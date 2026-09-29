const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const { analyzeDemandComplexity, scoreExperts } = require("./src/matcher");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");
const EXCEL_SEED_FILE = path.join(DATA_DIR, "excel-seed.json");
const PUBLIC_DIR = path.join(__dirname, "public");
const SEED_VERSION = 8;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || "glm-4-flash";
const ZHIPU_SEARCH_MODEL = process.env.ZHIPU_SEARCH_MODEL || "glm-4-plus";
const DEMO_TOTALS = Object.freeze({
  demands: 3876,
  experts: 3129,
  techManagers: 2133,
  matches: 1672
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4"
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator === -1) return;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

const initialData = {
  users: [
    { id: 0, name: "平台管理员", role: "admin", phone: "13800000000", password: "admin123" },
    { id: 1, name: "创装备有限公司", role: "enterprise", phone: "13800000001", password: "qiye123" },
    { id: 2, name: "张明远", role: "expert", phone: "13800000002", password: "zhuanjia123" },
    { id: 3, name: "沈亦航", role: "manager", phone: "13800000003", password: "jingli123" }
  ],
  techManagers: [
    {
      id: 1,
      name: "沈亦航",
      title: "高级技术经理人",
      organization: "技术转移服务中心",
      region: "国内",
      industries: "新材料,智能制造,新能源",
      serviceTags: "需求澄清,专家邀约,样件验证,合同条款,政策申报",
      currentLoad: 7,
      responseRate: 94,
      dealCount: 28,
      focus: "擅长把材料、装备和新能源方向的早期成果推进到样件验证和联合开发协议。"
    },
    {
      id: 2,
      name: "陆知远",
      title: "长三角产业撮合官",
      organization: "上海国家技术转移东部中心协作网络",
      region: "上海",
      industries: "新材料,生物医药,节能环保",
      serviceTags: "企业访谈,技术尽调,专利FTO,投融资对接,长三角资源",
      currentLoad: 5,
      responseRate: 91,
      dealCount: 35,
      focus: "熟悉长三角企业采购和产业基金需求，可承接跨区域供需对接与尽调。"
    }
  ],
  achievements: [
    {
      id: 1,
      name: "高端装备智能运维边缘计算系统",
      completer: "张明远团队",
      organization: "大学智能制造研究院",
      summary: "面向长三角先进制造企业的设备状态感知、故障预测与能耗优化系统。",
      field: "智能制造",
      form: "软件系统+示范产线",
      stage: "中试",
      level: "国内领先",
      keywords: "边缘计算,预测性维护,工业互联网,装备制造",
      contact: "张明远",
      transferMode: "技术许可/联合开发",
      transferNote: "可在制造基地与长三角龙头企业联合开展应用验证。"
    },
    {
      id: 2,
      name: "低碳绿色建材固废协同利用技术",
      completer: "李清禾团队",
      organization: "科学院材料所",
      summary: "利用工业固废制备高强低碳建材，适配园区循环经济场景。",
      field: "新材料",
      form: "工艺包+样品",
      stage: "产业化前期",
      level: "国内先进",
      keywords: "绿色建材,固废资源化,低碳材料,循环经济",
      contact: "李清禾",
      transferMode: "成果转让/作价入股",
      transferNote: "建议与江苏、浙江建材企业共建试生产线。"
    },
    {
      id: 3,
      name: "生物医药高通量筛选数据平台",
      completer: "陈思源团队",
      organization: "上海交通大学医学院协作实验室",
      summary: "融合实验数据治理、候选药物评估和AI辅助筛选能力。",
      field: "生物医药",
      form: "平台系统",
      stage: "应用示范",
      level: "国际先进",
      keywords: "生物医药,高通量筛选,数据治理,AI制药",
      contact: "陈思源",
      transferMode: "联合开发/委托研发",
      transferNote: "面向生物医药企业提供模型和实验流程共建。"
    }
  ],
  experts: [
    {
      id: 1,
      name: "张明远",
      title: "教授级高工",
      organization: "大学智能制造研究院",
      region: "国内",
      field: "智能制造",
      keywords: "装备制造,工业互联网,边缘计算,预测性维护,数字孪生",
      bio: "长期服务装备制造企业数字化升级，主持多项省部级智能制造项目。",
      activeScore: 94
    },
    {
      id: 2,
      name: "李清禾",
      title: "研究员",
      organization: "科学院材料所",
      region: "国内",
      field: "新材料",
      keywords: "绿色建材,固废资源化,低碳材料,无机非金属材料",
      bio: "聚焦工业固废高值化利用与绿色建材产业化。",
      activeScore: 88
    },
    {
      id: 3,
      name: "周彦",
      title: "首席科学家",
      organization: "苏州纳米技术协同创新中心",
      region: "江苏苏州",
      field: "新材料",
      keywords: "纳米材料,传感器,半导体材料,薄膜工艺",
      bio: "长期推进长三角新材料企业技术攻关和成果落地。",
      activeScore: 91
    },
    {
      id: 4,
      name: "陈思源",
      title: "副教授",
      organization: "上海交通大学医学院协作实验室",
      region: "上海",
      field: "生物医药",
      keywords: "AI制药,高通量筛选,药物发现,数据治理",
      bio: "负责多家药企联合研发数据平台建设。",
      activeScore: 86
    },
    {
      id: 5,
      name: "吴若澜",
      title: "产业顾问",
      organization: "杭州未来科技城成果转化中心",
      region: "浙江杭州",
      field: "人工智能",
      keywords: "大模型,企业智能体,知识图谱,产业匹配",
      bio: "专注企业智能体和产学研供需撮合系统。",
      activeScore: 90
    }
  ],
  agents: [
    { id: 1, name: "成果转化官", nickname: "果小转", role: "transferOfficer", category: "成果画像", desc: "理解成果并生成结构化画像，智能匹配企业。", prompt: "请把高强耐蚀Al-Zn-Mg铝合金成果整理成企业看得懂的转化画像，并推荐3类应用企业。", order: 1 },
    { id: 2, name: "需求解析师", nickname: "需小析", role: "demandAnalyst", category: "需求澄清", desc: "拆解模糊需求，输出标准化需求单。", prompt: "请把“无人装备需要轻量化耐腐蚀材料”拆成标准需求单。", order: 2 },
    { id: 3, name: "专利猎手", nickname: "专小猎", role: "patentHunter", category: "专利尽调", desc: "执行全球专利检索与可行性评估。", prompt: "请围绕Al-Zn-Mg特种铝合金在无人装备中的应用，给出专利检索关键词和FTO风险初评。", order: 3 }
  ],
  videos: [
    { id: 1, title: "供需智能撮合演示", category: "平台演示", cover: "实时对接大厅", desc: "演示需求发布、专家匹配、智能体预沟通和经理人派单全过程。", order: 1 },
    { id: 2, title: "一对一磋商室演示", category: "智能体协同", cover: "科小企 × 科小专", desc: "逐句展示企业方和专家方智能体如何确认指标、成本、责任和样件计划。", order: 2 }
  ],
  demands: [
    {
      id: 1,
      name: "高端装备故障预测与能耗优化",
      company: "创装备有限公司",
      field: "智能制造",
      technicalIndicators: "设备停机预测准确率不低于85%，能耗降低8%以上。",
      problem: "关键设备运行数据分散，缺少可解释的预测维护模型。",
      foundation: "已有PLC和MES系统，具备两条示范产线。",
      budget: 1200000,
      cooperation: "联合开发",
      orgType: "民营企业",
      budgetAmount: 1200000,
      demandType: "技术攻关",
      region: "国内",
      validUntil: "2026-12-31",
      updatedAt: new Date().toISOString(),
      source: "企业自主发布",
      keywords: "装备制造,预测性维护,工业互联网,能耗优化",
      publisherId: 1
    }
  ],
  matches: [],
  conversations: [],
  messages: []
};

const enrichment = {
  achievements: [
    ["高强耐蚀Al-Zn-Mg特种铝合金材料", "铝合金材料研发团队", "科学院高新技术研究中心", "面向高端无人机、无人艇和近海装备平台的轻量化高强韧耐腐蚀铝合金材料，抗拉强度可达450MPa以上，兼顾动态冲击性能和焊接加工性能。", "新材料", "新材料+中试工艺包", "中试阶段", "国内领先", "Al-Zn-Mg,特种铝合金,无人装备,动态冲击,耐腐蚀,轻量化", "柴保国", "联合开发/技术许可/长期供应", "建议与无人装备制造商开展样件验证、焊接工艺优化和长期供应协议谈判。"],
    ["新能源商用车电池热管理系统", "王澈团队", "合肥工业大学汽车工程学院", "面向物流车队与长三角整车企业的电池热安全、低温续航和寿命预测方案。", "新能源", "控制算法+样机", "中试", "国内先进", "电池热管理,新能源汽车,寿命预测,热安全", "王澈", "联合开发/技术许可", "适合与、合肥、上海整车及零部件企业联合验证。"],
    ["农业遥感病虫害智能识别平台", "孙嘉宁团队", "农业大学信息与管理科学学院", "利用多源遥感和田间图像识别小麦、玉米病虫害，支持县域农技服务。", "人工智能", "平台系统+移动端", "应用示范", "国内领先", "遥感,图像识别,智慧农业,病虫害", "孙嘉宁", "技术服务/联合运营", "可与安徽、江苏农业服务公司开展跨区推广。"],
    ["半导体湿法装备关键部件耐腐蚀涂层", "赵屿团队", "苏州纳米技术协同创新中心", "面向湿法刻蚀设备关键部件的高致密耐腐蚀涂层工艺。", "新材料", "工艺包+检测报告", "产业化前期", "国际先进", "半导体装备,耐腐蚀涂层,薄膜工艺", "赵屿", "成果转让/委托开发", "建议对接电子材料与长三角装备企业。"],
    ["工业园区碳排放数字孪生系统", "吴若澜团队", "杭州未来科技城成果转化中心", "对园区能源、产线与物流碳排放进行核算、预测和减排策略推演。", "节能环保", "SaaS平台", "应用示范", "国内先进", "碳核算,数字孪生,园区能源,节能减排", "吴若澜", "联合运营/技术服务", "可服务产业园与长三角绿色工厂建设。"],
    ["高性能可降解医用敷料制备技术", "陈思源团队", "上海交通大学医学院协作实验室", "基于生物相容材料的可降解创面敷料，具备抑菌和缓释能力。", "生物医药", "样品+工艺包", "临床前", "国内先进", "医用敷料,生物材料,缓释,抑菌", "陈思源", "作价入股/联合开发", "适合对接医疗器械企业开展注册转化。"],
    ["矿山安全多模态感知预警系统", "郭致远团队", "中国矿业大学安全工程中心", "融合视频、气体、微震和人员定位，实现矿山风险实时预警。", "安全应急", "软硬件系统", "示范应用", "国内领先", "矿山安全,多模态感知,风险预警,边缘计算", "郭致远", "委托研发/技术许可", "适合能源企业与江苏传感器企业联合落地。"],
    ["食品冷链品质追溯智能标签", "叶澄团队", "江南大学食品科学学院", "利用柔性传感标签记录冷链温度、湿度和品质变化，支持扫码追溯。", "现代食品", "样品+平台接口", "中试", "国内先进", "冷链,智能标签,食品安全,柔性传感", "叶澄", "技术许可/供应链合作", "可用于食品加工企业进入长三角商超渠道。"],
    ["高端轴承表面强化与寿命评估技术", "刘钧团队", "轴承研究院", "提升高端轴承耐磨、耐疲劳性能，并建立寿命评估模型。", "智能制造", "工艺包+检测服务", "产业化", "国内领先", "高端轴承,表面强化,寿命评估,精密制造", "刘钧", "技术服务/联合开发", "可服务装备制造与长三角机器人企业。"],
    ["水污染微量有机物快速检测芯片", "周彦团队", "苏州纳米技术协同创新中心", "用于工业废水中微量有机污染物现场快速检测。", "节能环保", "检测芯片+仪器", "中试", "国际先进", "水处理,检测芯片,纳米材料,环境监测", "周彦", "成果转让/联合开发", "适合环保装备企业产品化。"]
  ],
  experts: [
    ["顾承铝", "材料首席科学家", "科学院高新技术研究中心", "国内", "新材料", "Al-Zn-Mg,特种铝合金,高强韧,盐雾耐腐蚀,动态冲击,焊接工艺", "长期从事高强铝合金成分设计、过渡族元素协同强化和无人装备材料应用验证。", 96],
    ["王澈", "教授", "合肥工业大学汽车工程学院", "安徽合肥", "新能源", "新能源汽车,电池热管理,热安全,寿命预测,控制算法", "深耕新能源车热管理和电池安全，服务多家整车厂联合研发。", 89],
    ["孙嘉宁", "副教授", "农业大学信息与管理科学学院", "国内", "人工智能", "智慧农业,遥感,图像识别,病虫害识别,农业大数据", "负责农业AI与县域农技服务平台建设。", 87],
    ["赵屿", "研究员", "苏州纳米技术协同创新中心", "江苏苏州", "新材料", "半导体材料,耐腐蚀涂层,湿法装备,薄膜工艺", "关注半导体装备关键材料国产化。", 93],
    ["郭致远", "教授", "中国矿业大学安全工程中心", "江苏徐州", "安全应急", "矿山安全,多模态感知,边缘计算,风险预警", "主持矿山安全感知与智能预警工程项目。", 85],
    ["叶澄", "教授", "江南大学食品科学学院", "江苏无锡", "现代食品", "食品冷链,柔性传感,品质追溯,智能标签", "推动食品安全检测技术产业化。", 82],
    ["刘钧", "正高级工程师", "轴承研究院", "国内", "智能制造", "高端轴承,精密制造,表面强化,寿命评估", "长期服务高端装备与机器人轴承攻关。", 92],
    ["林嘉树", "产业教授", "上海人工智能研究院", "上海", "人工智能", "知识图谱,大模型应用,智能客服,产业匹配", "擅长企业级AI系统、智能体流程和知识工程。", 91],
    ["孟晓岚", "主任医师", "大学第一附属医院转化医学中心", "国内", "生物医药", "医疗器械,临床验证,医用材料,注册转化", "负责临床需求凝练和医疗器械转化评价。", 84],
    ["何予川", "研究员", "浙江大学能源工程学院", "浙江杭州", "节能环保", "碳核算,能源优化,园区低碳,工业节能", "服务长三角园区低碳化与能源系统优化。", 88],
    ["唐砚秋", "高级工程师", "安徽省机器人产业创新中心", "安徽芜湖", "智能制造", "机器人,机器视觉,柔性产线,运动控制", "参与机器人产线改造和核心部件应用验证。", 86],
    ["邵景行", "教授", "南京航空航天大学无人系统研究院", "江苏南京", "低空经济", "无人机,飞控系统,轻量化结构,适航验证,低空物流", "长期承担无人机平台总体设计和低空场景适航验证项目。", 95],
    ["袁砺", "研究员", "上海材料基因组工程研究院", "上海", "新材料", "材料基因组,高通量计算,合金设计,性能预测", "面向高性能合金、复合材料和材料数据库建设提供研发支持。", 93],
    ["韩若水", "教授级高工", "江苏省产业技术研究院先进制造所", "江苏南京", "智能制造", "工业软件,数字孪生,工艺优化,质量追溯,MES", "服务汽车零部件、装备制造企业数字化工厂和质量闭环。", 90],
    ["秦砚", "研究员", "中国科学院合肥物质科学研究院", "安徽合肥", "新能源", "氢能,燃料电池,电解水制氢,储能安全", "聚焦氢能装备和新型储能系统安全评估与工程示范。", 89],
    ["许南乔", "教授", "同济大学环境科学与工程学院", "上海", "节能环保", "工业废水,膜分离,水污染治理,资源回收", "承担工业园区废水深度处理与资源化项目。", 88],
    ["罗珩", "首席工程师", "宁波智能传感产业研究院", "浙江宁波", "人工智能", "工业传感器,边缘AI,设备健康,智能检测", "擅长把传感器、边缘AI与设备运维场景打通。", 91],
    ["杜清越", "教授", "江南大学生物工程学院", "江苏无锡", "现代食品", "发酵工程,酶制剂,功能食品,菌种筛选", "推动食品生物制造和功能食品成果产业化。", 86],
    ["郑明砚", "主任", "医疗器械检验检测中心", "国内", "生物医药", "医疗器械,注册检验,生物相容性,质量体系", "熟悉医疗器械注册检验和质量体系建设。", 84],
    ["陆瑾瑜", "教授", "华东理工大学化工学院", "上海", "新材料", "高分子材料,阻燃材料,特种涂层,连续化制备", "面向高分子新材料中试放大和连续化工艺优化。", 90],
    ["蒋泊舟", "高级工程师", "中电科智能装备创新中心", "浙江杭州", "安全应急", "应急通信,无人巡检,多源感知,指挥调度", "服务城市安全、应急通信和无人化巡检装备应用。", 87],
    ["胡安澜", "教授", "工业大学粮油食品学院", "国内", "现代食品", "粮油加工,食品安全,近红外检测,品质控制", "长期服务食品加工企业质量提升和智能检测。", 85],
    ["马清晖", "研究员", "上海微系统与信息技术研究所", "上海", "集成电路", "MEMS,先进封装,传感芯片,可靠性测试", "聚焦MEMS传感芯片、先进封装和可靠性验证。", 94],
    ["苏若楠", "教授", "浙江大学控制科学与工程学院", "浙江杭州", "人工智能", "工业视觉,强化学习,智能调度,机器人控制", "承担工业视觉检测和智能调度算法落地项目。", 92],
    ["魏知行", "教授级高工", "机械研究所有限公司", "国内", "智能制造", "齿轮传动,可靠性设计,智能检测,高端装备", "服务高端装备传动系统国产替代和寿命评估。", 90]
  ],
  demands: [
    ["无人装备高强耐蚀轻量化铝合金材料", "长三角无人装备制造有限公司", "新材料", "抗拉强度≥450MPa，屈服强度≥380MPa，延伸率≥7%，厚度方向压缩强度≥600MPa；高应变率动态冲击性能稳定；盐雾试验1000小时无明显腐蚀；支持MIG/TIG焊接和复杂构件加工。", "现有7075铝合金在近海高盐雾环境维护成本高，焊接热影响区强度衰减明显；高端无人机和无人艇平台迫切需要兼顾轻量化、抗冲击、耐腐蚀和可批量供应的新材料。", "年需求约200吨，具备无人机与无人艇结构件设计能力、材料验证实验室、疲劳测试平台和小批量试制线。", 12000000, "联合开发+长期供应", "民营企业", 12000000, "成果转化采购", "江苏苏州", "2027-12-31", "智能体演示需求", "Al-Zn-Mg,铝合金,无人装备,无人机,无人艇,耐腐蚀,动态冲击,轻量化"],
    ["动力电池低温续航提升技术", "新能源物流车有限公司", "新能源", "低温环境续航衰减降低15%，热失控预警提前5分钟。", "冬季低温下车辆续航下降明显，缺少可量产的热管理方案。", "已有200台运营车辆数据和电池包测试台架。", 1800000, "联合开发", "民营企业", 1800000, "技术攻关", "国内", "2027-03-31", "园区征集", "新能源汽车,电池热管理,热安全"],
    ["半导体清洗设备耐腐蚀材料替代", "电子装备制造有限公司", "新材料", "关键部件耐腐蚀寿命提升2倍，兼容主流湿法工艺。", "进口涂层成本高，交付周期长，国产替代验证不足。", "具备小批量部件加工能力和洁净装配间。", 2500000, "委托研发", "民营企业", 2500000, "国产替代", "国内", "2027-06-30", "企业自主发布", "半导体装备,耐腐蚀涂层,湿法清洗"],
    ["食品冷链温控与品质追溯", "食品供应链集团", "现代食品", "冷链异常识别准确率90%，标签成本控制在2元以内。", "跨区域运输温控记录不连续，品质责任追溯困难。", "已有冷链车队、仓储系统和销售渠道。", 900000, "技术许可", "国有企业", 900000, "产品升级", "国内", "2026-11-30", "政府平台征集", "食品冷链,智能标签,品质追溯"],
    ["矿山井下风险智能预警", "能源集团", "安全应急", "多源传感融合预警准确率不低于88%，误报率低于8%。", "井下视频、气体和人员定位系统孤立，综合研判不足。", "已有井下网络、传感器和安全调度中心。", 3200000, "联合开发", "国有企业", 3200000, "安全提升", "国内", "2027-02-28", "企业自主发布", "矿山安全,多模态感知,风险预警"],
    ["园区碳排放核算与节能调度", "先进制造产业园", "节能环保", "覆盖80家企业碳核算，提出可执行节能调度方案。", "企业能耗数据口径不统一，缺少园区级减排推演工具。", "园区已有能源计量平台和企业基础台账。", 1500000, "联合运营", "园区平台", 1500000, "数字化建设", "国内", "2027-01-15", "园区征集", "碳核算,数字孪生,工业节能"],
    ["县域小麦病虫害遥感监测", "智慧农业发展中心", "人工智能", "病虫害识别准确率85%，支持乡镇级预警图层。", "人工巡田效率低，病虫害发现滞后。", "已有无人机航飞数据和农情站点。", 800000, "技术服务", "事业单位", 800000, "农业数字化", "国内", "2026-10-31", "政府平台征集", "遥感,图像识别,智慧农业,病虫害"],
    ["医用敷料规模化制备及注册验证", "康宁医疗器械有限公司", "生物医药", "完成中试放大和注册检验，抑菌率达到行业标准。", "现有产品同质化严重，希望引入可降解高端敷料技术。", "具备十万级洁净车间和医疗器械注册团队。", 2100000, "作价入股", "民营企业", 2100000, "成果转化", "国内", "2027-05-31", "企业自主发布", "医用敷料,生物材料,注册转化"],
    ["机器人柔性打磨视觉引导系统", "智能装备有限公司", "智能制造", "复杂曲面识别精度0.2mm，节拍提升20%。", "人工打磨一致性差，现有视觉系统对反光表面稳定性不足。", "已有机器人工作站和样件库。", 1600000, "联合开发", "民营企业", 1600000, "产线升级", "国内", "2027-04-30", "企业自主发布", "机器人,机器视觉,柔性产线"],
    ["低空物流无人机复合材料机身减重", "杭州低空物流科技有限公司", "低空经济", "机身结构减重12%以上，满足载荷20kg、航程80km、抗风6级要求。", "现有碳纤维结构成本高、维修困难，希望引入轻量化、可维修、可批量加工的新材料方案。", "已具备低空物流试运营航线、飞控平台和结构件装配能力。", 6000000, "联合开发", "民营企业", 6000000, "低空经济示范", "浙江杭州", "2027-09-30", "产业链征集", "低空经济,无人机,复合材料,轻量化,适航验证"],
    ["氢燃料电池系统低温启动与安全监测", "氢能装备有限公司", "新能源", "零下20摄氏度启动时间小于60秒，氢泄漏预警响应小于3秒。", "燃料电池在低温环境启动慢，缺少面向商用车和工程车辆的安全监测方案。", "已有30kW电堆测试平台、整车集成团队和试验车辆。", 4200000, "委托研发", "民营企业", 4200000, "新能源装备", "国内", "2027-08-31", "企业自主发布", "氢能,燃料电池,低温启动,安全监测"],
    ["高端数控机床热误差补偿算法", "昆山精密装备有限公司", "智能制造", "连续加工8小时定位误差控制在8微米以内，模型可在线自学习。", "现有机床热漂移导致批量零件一致性不足，进口补偿系统成本高。", "具备五轴加工中心、温度采集系统和历史加工数据。", 2800000, "联合开发", "民营企业", 2800000, "国产替代", "江苏昆山", "2027-07-15", "产业链征集", "数控机床,热误差,工业软件,精密制造"],
    ["工业废水高盐有机物资源化处理", "化工园区运营公司", "节能环保", "COD去除率≥92%，盐分回收率≥80%，吨水处理成本降低15%。", "园区高盐有机废水成分复杂，现有蒸发工艺能耗高、资源化不足。", "已有污水处理站、在线监测系统和中试场地。", 5000000, "联合运营", "园区平台", 5000000, "绿色低碳", "国内", "2027-10-31", "园区征集", "工业废水,高盐废水,资源化,膜分离"],
    ["MEMS压力传感芯片可靠性提升", "智能传感器产业园", "集成电路", "芯片高温高湿老化1000小时漂移小于0.5%，良率提升至90%以上。", "MEMS压力芯片批次稳定性不足，封装可靠性和测试流程需要优化。", "园区已有传感器封装线、可靠性实验室和下游汽车电子客户。", 3500000, "技术服务+联合开发", "园区平台", 3500000, "集成电路攻关", "国内", "2027-11-30", "园区征集", "MEMS,压力传感器,先进封装,可靠性测试"],
    ["功能性发酵饮品菌种筛选与工艺放大", "功能食品有限公司", "现代食品", "筛选2-3株稳定功能菌株，完成500L发酵放大，货架期达到6个月。", "现有发酵饮品口感不稳定，菌株功能评价和规模化工艺不足。", "具备饮品灌装线、基础微生物实验室和渠道试销资源。", 1200000, "技术许可", "民营企业", 1200000, "产品升级", "国内", "2027-03-31", "企业自主发布", "功能食品,发酵工程,菌种筛选,工艺放大"],
    ["矿区无人巡检应急通信一体化装备", "山西-能源装备联合体", "安全应急", "井下/矿区边缘通信覆盖率提升至95%，无人巡检异常识别准确率≥90%。", "矿区通信盲区多，巡检人员安全风险高，需要无人巡检和应急通信融合装备。", "已有矿区试点、巡检机器人底盘和调度平台。", 5200000, "联合开发", "国有企业", 5200000, "安全提升", "国内", "2027-12-31", "企业自主发布", "矿区安全,应急通信,无人巡检,多源感知"],
    ["高阻燃可回收电池包复合材料", "合肥新能源汽车零部件有限公司", "新材料", "UL94 V-0等级，热失控隔热时间提升30%，材料可回收率≥70%。", "现有电池包防护材料阻燃与轻量化难以兼顾，回收处理成本高。", "具备电池包壳体产线、热失控测试资源和主机厂客户。", 4600000, "联合开发", "民营企业", 4600000, "新材料应用", "安徽合肥", "2027-09-20", "企业自主发布", "阻燃材料,电池包,复合材料,新能源汽车"],
    ["粮油品质近红外快速检测设备", "粮食产业集团", "现代食品", "水分、蛋白、脂肪等指标检测误差小于3%，单样检测时间小于30秒。", "粮油收储环节检测慢、人工误差大，希望建设快速无损检测和数据追溯系统。", "已有粮库、质检中心和收储信息化系统。", 1800000, "技术服务", "国有企业", 1800000, "质量提升", "国内", "2027-06-30", "政府平台征集", "粮油检测,近红外,食品安全,质量追溯"],
    ["绿色建筑相变储能墙体材料", "苏州绿色建筑科技有限公司", "节能环保", "墙体材料相变温度24-28摄氏度，建筑空调能耗降低8%以上。", "既有绿色建材保温性能有限，缺少兼具储能、阻燃、可施工的新型墙体材料。", "已有装配式建筑合作项目、材料实验室和示范楼宇。", 2400000, "成果转让", "民营企业", 2400000, "绿色建筑", "江苏苏州", "2027-08-15", "企业自主发布", "相变材料,绿色建筑,节能建材,储能"],
    ["医用可降解止血材料临床前评价", "高端医疗材料有限公司", "生物医药", "完成生物相容性、降解周期、止血效率和灭菌工艺验证，形成注册检验材料。", "产品已有实验室样品，但临床前评价、注册路径和中试工艺不清晰。", "具备洁净车间、质量体系人员和动物实验合作资源。", 3000000, "作价入股+联合开发", "民营企业", 3000000, "医疗器械转化", "国内", "2027-12-20", "企业自主发布", "止血材料,可降解材料,医疗器械,注册检验"],
    ["工业视觉缺陷检测模型小样本泛化", "宁波汽车零部件有限公司", "人工智能", "新零件上线样本少于50张时，缺陷识别准确率≥92%。", "汽车零部件型号多、缺陷样本少，现有视觉模型换线成本高。", "已有视觉工位、历史缺陷图像和产线MES接口。", 2200000, "委托研发", "民营企业", 2200000, "AI质检", "浙江宁波", "2027-05-30", "企业自主发布", "工业视觉,小样本学习,缺陷检测,汽车零部件"],
    ["高端齿轮传动系统寿命预测", "装备传动有限公司", "智能制造", "建立齿轮寿命预测模型，早期故障预警提前72小时，误报率低于8%。", "高端齿轮箱工况复杂，缺少可解释寿命预测模型和台架验证方案。", "已有齿轮箱台架、振动采集系统和售后故障数据。", 2600000, "联合开发", "民营企业", 2600000, "高端装备", "国内", "2027-07-31", "企业自主发布", "齿轮传动,寿命预测,振动分析,高端装备"]
  ],
  techManagers: [
    ["林芷晴", "技术经理人", "苏州科技成果转化服务联盟", "江苏苏州", "半导体装备,新材料,智能制造", "企业走访,专家路演,中试资源,技术合同登记", 6, 96, 41, "服务半导体装备和先进材料国产替代，擅长组织长三角企业验证场景。"],
    ["周明澈", "产业技术经理人", "浙江大学国家大学科技园", "浙江杭州", "人工智能,节能环保,现代食品", "需求诊断,数据合规,联合申报,商业计划书", 4, 89, 24, "聚焦AI应用和园区低碳项目，能把模糊需求拆成可采购、可验收的任务单。"],
    ["唐婉宁", "投融资型技术经理人", "中原科创基金服务中心", "国内", "新材料,生物医药,新能源", "基金路演,估值建议,产业资本,政策资金", 8, 88, 19, "连接科创基金和长三角产业资本，适合承接样件验证后的融资与订单转化。"],
    ["贺云舟", "技术合同经理人", "安徽科技大市场协作中心", "安徽合肥", "新能源汽车,智能制造,安全应急", "技术合同,验收指标,质量责任,供应链协同", 3, 93, 31, "擅长把技术指标、质量责任和交付节点写进合同，降低跨区域合作风险。"],
    ["许知微", "医疗器械转化经理人", "上海转化医学创新服务平台", "上海", "生物医药,医疗器械,新材料", "注册路径,临床资源,伦理材料,样品验证", 5, 90, 22, "专注医用材料和器械注册转化，熟悉临床验证与产品注册流程。"],
    ["宋嘉禾", "农业科技经理人", "农业科技成果转化中心", "国内", "现代农业,人工智能,现代食品", "县域场景,农技服务,示范基地,渠道推广", 4, 87, 26, "长期服务县域农业数字化和食品产业链成果转化，能组织示范田和渠道验证。"]
  ]
};

function enrichStore(store) {
  ensureDemoUsers(store);
  if (!store.agents) store.agents = initialData.agents.map((item) => ({ ...item }));
  if (!store.videos) store.videos = initialData.videos.map((item) => ({ ...item }));
  addMany(store.achievements, enrichment.achievements, (row) => ({
    id: nextId(store.achievements),
    name: row[0],
    completer: row[1],
    organization: row[2],
    summary: row[3],
    field: row[4],
    form: row[5],
    stage: row[6],
    level: row[7],
    keywords: row[8],
    contact: row[9],
    transferMode: row[10],
    transferNote: row[11]
  }));
  addMany(store.experts, enrichment.experts, (row) => ({
    id: nextId(store.experts),
    name: row[0],
    title: row[1],
    organization: row[2],
    region: row[3],
    field: row[4],
    keywords: row[5],
    bio: row[6],
    activeScore: row[7]
  }));
  addMany(store.demands, enrichment.demands, (row) => ({
    id: nextId(store.demands),
    name: row[0],
    company: row[1],
    field: row[2],
    technicalIndicators: row[3],
    problem: row[4],
    foundation: row[5],
    budget: row[6],
    cooperation: row[7],
    orgType: row[8],
    budgetAmount: row[9],
    demandType: row[10],
    region: row[11],
    validUntil: row[12],
    updatedAt: new Date().toISOString(),
    source: row[13],
    keywords: row[14],
    publisherId: 1
  }));
  if (!store.techManagers) store.techManagers = [];
  addMany(store.techManagers, enrichment.techManagers, (row) => ({
    id: nextId(store.techManagers),
    name: row[0],
    title: row[1],
    organization: row[2],
    region: row[3],
    industries: row[4],
    serviceTags: row[5],
    currentLoad: row[6],
    responseRate: row[7],
    dealCount: row[8],
    focus: row[9]
  }));
  addExcelSeed(store);
  store.seedVersion = SEED_VERSION;
  return store;
}

function ensureDemoUsers(store) {
  if (!store.users) store.users = [];
  const demoUsers = [
    { id: 0, name: "平台管理员", role: "admin", phone: "13800000000", password: "admin123" },
    { id: 1, name: "创装备有限公司", role: "enterprise", phone: "13800000001", password: "qiye123" },
    { id: 2, name: "张明远", role: "expert", phone: "13800000002", password: "zhuanjia123" },
    { id: 3, name: "沈亦航", role: "manager", phone: "13800000003", password: "jingli123" }
  ];
  demoUsers.forEach((demo) => {
    const existing = store.users.find((item) => item.phone === demo.phone || item.role === demo.role && item.id === demo.id);
    if (existing) Object.assign(existing, demo);
    else store.users.push(demo);
  });
}

function addExcelSeed(store) {
  if (!fs.existsSync(EXCEL_SEED_FILE)) return;
  const seed = JSON.parse(fs.readFileSync(EXCEL_SEED_FILE, "utf8"));
  addObjects(store.achievements, seed.achievements || [], normalizeAchievement);
  addObjects(store.demands, seed.demands || [], normalizeDemand);
  addObjects(store.experts, seed.experts || [], normalizeExpert);
}

function getCollectionConfig(type) {
  return {
    achievements: { key: "achievements", singular: "achievement", normalizer: normalizeAchievement, required: "name" },
    demands: { key: "demands", singular: "demand", normalizer: normalizeDemand, required: "name" },
    experts: { key: "experts", singular: "expert", normalizer: normalizeExpert, required: "name" },
    techManagers: { key: "techManagers", singular: "techManager", normalizer: normalizeTechManager, required: "name" },
    matches: { key: "matches", singular: "match", normalizer: normalizeMatch, required: "demandName" },
    agents: { key: "agents", singular: "agent", normalizer: normalizeAgent, required: "name" },
    videos: { key: "videos", singular: "video", normalizer: normalizeVideo, required: "title" }
  }[type];
}

function addObjects(target, rows, normalizer) {
  rows.forEach((row) => {
    const item = normalizer(row, nextId(target));
    if (item.name && !target.some((existing) => existing.name === item.name)) target.push(item);
  });
}

function addMany(target, rows, factory) {
  rows.forEach((row) => {
    if (!target.some((item) => item.name === row[0])) target.push(factory(row));
  });
}

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
  const store = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  if (store.seedVersion !== SEED_VERSION) {
    writeStore(enrichStore(store));
  } else if (!store.techManagers || !store.agents || !store.videos) {
    if (!store.techManagers) store.techManagers = [];
    if (!store.agents) store.agents = initialData.agents.map((item) => ({ ...item }));
    if (!store.videos) store.videos = initialData.videos.map((item) => ({ ...item }));
    writeStore(store);
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function parseMoney(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").replace(/,/g, "").trim();
  if (!text || /面议|未说明|无/.test(text)) return 0;
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return 0;
  let amount = Number(match[1]);
  if (text.includes("亿")) amount *= 100000000;
  else if (text.includes("万")) amount *= 10000;
  return Math.round(amount);
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function evaluateDemandAuthenticity(body) {
  const demandText = [
    body.name,
    body.company,
    body.field,
    body.detail,
    body.technicalIndicators,
    body.problem,
    body.foundation,
    body.cooperation,
    body.orgType,
    body.budgetText,
    body.budgetAmount,
    body.demandType,
    body.region,
    body.source
  ].join(" ");
  const text = demandText.replace(/\s+/g, "");
  const vague = /未说明|面议|其他|暂无|无。?$|待定|不详|技术指标面议|根据需要|看情况|越高越好|越低越好|尽快|先进水平/;
  const platformWords = ["交易市场", "科技创新中心", "情报研究所", "代理企业", "服务中心", "产业园", "发展中心", "运营公司", "协会", "平台"];
  const industryWords = ["新材料", "人工智能", "现代农业", "生物医药", "电子信息", "新能源", "节能环保", "高端装备", "智能制造", "食品", "化工", "医疗器械", "无人机", "机器人", "传感器", "储能", "种业", "大棚", "铝合金", "腐蚀", "焊接", "产线", "工艺", "材料", "装备"];
  const quantWords = ["≥", "≤", "%", "MPa", "GPa", "km", "kg", "nm", "μm", "微米", "小时", "秒", "吨", "万元", "准确率", "良率", "成本", "半径", "载重", "日均", "ppm", "kWh", "℃"];
  const foundationWords = ["产线", "车间", "设备", "实验室", "样品", "样件", "试点", "中试", "客户", "团队", "数据", "台架", "平台", "专利", "洁净", "测试", "订单", "批量", "供应商"];
  const scenarioWords = ["生产", "应用", "场景", "工艺", "产品", "产线", "试点", "客户", "运营", "示范", "交付", "产业化", "采购", "验证", "验收", "质量", "供应链"];
  const contradictionPairs = [
    [/预算.{0,8}(0|无|没有|不投入)/, /预算|万元|采购|联合开发/],
    [/无基础|没有基础|暂无基础/, /产线|设备|实验室|中试|客户|订单|数据/],
    [/无指标|指标待定|技术指标面议/, /≥|≤|准确率|良率|强度|小时|吨|%/],
    [/仅咨询|了解一下/, /采购|长期供应|联合开发|预算|样件/]
  ];
  const riskTags = [];
  const strengths = [];

  let problemClarityScore = 0;
  const name = String(body.name || "");
  const detail = String(body.detail || body.summary || "");
  const problem = String(body.problem || "");
  const foundation = String(body.foundation || "");
  const indicators = String(body.technicalIndicators || "");
  const textLength = [name, detail, problem, foundation, indicators].join("").replace(/\s+/g, "").length;
  if (textLength >= 220) problemClarityScore += 5;
  else if (textLength >= 150) problemClarityScore += 4;
  else if (textLength >= 90) problemClarityScore += 3;
  else if (textLength >= 50) problemClarityScore += 2;
  if (name.length >= 8 && !vague.test(name)) problemClarityScore += 2;
  if (detail.length >= 40 && !vague.test(detail)) problemClarityScore += 3;
  if (problem.length >= 25 && !vague.test(problem)) problemClarityScore += 4;
  if (/痛点|瓶颈|替代|升级|降本|提质|效率|安全|质量|稳定|可靠|国产化|规模化|注册|量产/.test(`${detail}${problem}`)) problemClarityScore += 1;
  if (detail.length < 30) riskTags.push("需求详情字数不足");
  if (problem.length < 15) riskTags.push("技术难题描述过短");

  let technicalScore = 0;
  const numericCount = countMatches(indicators, /\d+(?:\.\d+)?|≥|≤|不低于|不高于|以内|以上|以下/g);
  if (numericCount >= 3 || includesAny(indicators, quantWords)) technicalScore += 9;
  else if (numericCount >= 1) technicalScore += 5;
  if (/验收|准确率|良率|成本|寿命|误报率|响应|时间|强度|半径|载重|去除率|回收率|盐雾|焊接|能耗/.test(indicators)) technicalScore += 6;
  if (indicators.length >= 35 && !vague.test(indicators)) technicalScore += 5;
  if (!indicators || vague.test(indicators)) riskTags.push("技术指标不可验证");

  let industryFitScore = 0;
  const field = String(body.field || "");
  const keywords = String(body.keywords || "");
  if (field && includesAny(`${field}${keywords}${name}${detail}`, industryWords)) industryFitScore += 7;
  if (includesAny(text, industryWords)) industryFitScore += 5;
  if (field && detail && includesAny(detail, field.split(/[，,、;；\s]/).filter(Boolean))) industryFitScore += 3;
  if (!field) riskTags.push("缺少技术领域");

  let enterpriseCredibilityScore = 0;
  const orgType = String(body.orgType || "");
  const company = String(body.company || "");
  if (company && !includesAny(company, platformWords)) enterpriseCredibilityScore += 6;
  if (/企业|公司|集团|厂|有限|股份/.test(company) || /企业|民营|国有|高新/.test(orgType)) enterpriseCredibilityScore += 5;
  if (body.contact || /联系人|电话|邮箱|手机/.test(text)) enterpriseCredibilityScore += 2;
  if (body.region) enterpriseCredibilityScore += 2;
  if (includesAny(company, platformWords)) riskTags.push("非企业本体或平台代填");
  if (!company) riskTags.push("缺少企业主体");

  let implementationReadinessScore = 0;
  if (includesAny(detail, scenarioWords) || includesAny(text, scenarioWords)) implementationReadinessScore += 5;
  if (includesAny(foundation, foundationWords)) implementationReadinessScore += 5;
  const budgetText = String(body.budgetText || body.budgetAmountText || body.budget || body.budgetAmount || "");
  const budgetAmount = parseMoney(budgetText);
  if (budgetAmount > 0) implementationReadinessScore += 4;
  if (body.cooperation && !vague.test(String(body.cooperation))) implementationReadinessScore += 3;
  if (body.validUntil || body.validUntilText || body.updatedAt) implementationReadinessScore += 2;
  if (/样件|测试|中试|试点|验证|采购|订单|客户|交付|量产/.test(text)) implementationReadinessScore += 1;
  if (!foundation || vague.test(foundation)) riskTags.push("现有基础不足");
  if (!budgetAmount) riskTags.push("预算金额未量化");

  let consistencyRiskScore = 15;
  contradictionPairs.forEach(([negative, positive]) => {
    if (negative.test(text) && positive.test(text)) consistencyRiskScore -= 5;
  });
  if (budgetAmount > 500000000 && !/集团|上市|大型|央企|国企/.test(`${company}${orgType}`)) {
    consistencyRiskScore -= 3;
    riskTags.push("预算与企业规模疑似不匹配");
  }
  if (field && name && !includesAny(`${name}${detail}${problem}${indicators}`, field.split(/[，,、;；\s]/).filter(Boolean))) {
    consistencyRiskScore -= 2;
  }
  if (consistencyRiskScore < 15) riskTags.push("文本存在前后矛盾或口径冲突");

  const dimensions = {
    enterpriseCredibility: Math.min(enterpriseCredibilityScore, 15),
    problemClarity: Math.min(problemClarityScore, 15),
    technicalVerifiability: Math.min(technicalScore, 20),
    industryFit: Math.min(industryFitScore, 15),
    implementationReadiness: Math.min(implementationReadinessScore, 20),
    consistencyRisk: Math.max(0, Math.min(consistencyRiskScore, 15))
  };
  // 真实性属于风险评估，不给绝对满分；即使字段完整，仍保留人工核验空间。
  const score = Math.min(99, Math.round(Object.values(dimensions).reduce((sum, value) => sum + value, 0)));
  if (score >= 80) strengths.push("需求可优先对接");
  if (dimensions.technicalVerifiability >= 14) strengths.push("技术指标较可验证");
  if (dimensions.implementationReadiness >= 14) strengths.push("具备实施基础、预算或验证条件");
  if (dimensions.enterpriseCredibility >= 12) strengths.push("企业主体信息较明确");
  if (dimensions.consistencyRisk >= 13) strengths.push("文本口径基本一致");

  const level = score >= 80 ? "高可信" : score >= 60 ? "基本可信" : score >= 40 ? "疑似虚假" : "虚假/高风险";
  const recommendation = score >= 80 ? "优先对接"
    : score >= 60 ? "补充访谈后对接"
    : score >= 40 ? "人工复核并要求补证"
    : "判定虚假，暂缓入库";

  return {
    score,
    level,
    isReal: score >= 60,
    verdict: score >= 60 ? "真实需求" : "虚假需求",
    recommendation,
    riskTags: [...new Set(riskTags)],
    strengths,
    dimensions,
    dimensionLabels: {
      enterpriseCredibility: "企业主体可信度",
      problemClarity: "需求问题明确度",
      technicalVerifiability: "技术指标可验证性",
      industryFit: "产业/主营相关性",
      implementationReadiness: "实施基础与转化可行性",
      consistencyRisk: "逻辑一致性与风险"
    },
    evaluatedAt: new Date().toISOString()
  };
}

function normalizeAchievement(body, id) {
  return {
    id,
    name: body.name || "",
    completer: body.completer || "",
    organization: body.organization || "",
    summary: body.summary || "",
    field: body.field || "",
    form: body.form || "",
    stage: body.stage || "",
    level: body.level || "",
    keywords: body.keywords || "",
    contact: body.contact || "",
    transferMode: body.transferMode || "",
    transferNote: body.transferNote || "",
    source: body.source || "管理员新增"
  };
}

function normalizeDemand(body, id) {
  const budgetText = body.budgetText || body.budgetAmountText || body.budget || body.budgetAmount || "";
  const budgetAmount = body.budgetText || body.budgetAmountText
    ? parseMoney(budgetText)
    : (Number(body.budgetAmount || body.budget || 0) || parseMoney(budgetText));
  const demand = {
    id,
    name: body.name || "",
    company: body.company || "",
    field: body.field || "",
    detail: body.detail || "",
    technicalIndicators: body.technicalIndicators || "",
    problem: body.problem || "",
    foundation: body.foundation || "",
    budget: budgetAmount,
    cooperation: body.cooperation || "",
    orgType: body.orgType || "",
    budgetAmount,
    budgetText: body.budgetText || body.budgetAmountText || (budgetAmount ? String(budgetAmount) : "面议"),
    demandType: body.demandType || "",
    region: body.region || "",
    validUntil: body.validUntil || "",
    validUntilText: body.validUntilText || body.validUntil || "",
    updatedAt: body.updatedAt || new Date().toISOString(),
    source: body.source || "管理员新增",
    contact: body.contact || "",
    evidence: body.evidence || "",
    keywords: body.keywords || [body.field, body.demandType, body.region].filter(Boolean).join(";"),
    publisherId: Number(body.publisherId || 1)
  };
  demand.authenticity = evaluateDemandAuthenticity(demand);
  return demand;
}

function demandWithAuthenticity(item) {
  return {
    ...item,
    authenticity: evaluateDemandAuthenticity(item)
  };
}

function sortDemandsByAuthenticity(items) {
  return (items || [])
    .map(demandWithAuthenticity)
    .sort((a, b) => {
      const scoreDiff = (b.authenticity?.score || 0) - (a.authenticity?.score || 0);
      if (scoreDiff) return scoreDiff;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
}

function normalizeExpert(body, id) {
  return {
    id,
    intro: body.intro || "",
    name: body.name || "",
    keywords: body.keywords || body.specialties || "",
    field: body.field || "",
    achievements: body.achievements || "",
    region: body.region || "",
    researchDirection: body.researchDirection || "",
    organization: body.organization || "",
    orgType: body.orgType || "",
    position: body.position || "",
    department: body.department || "",
    category: body.category || "",
    title: body.title || "",
    gender: body.gender || "",
    education: body.education || "",
    graduatedFrom: body.graduatedFrom || "",
    contact: body.contact || "",
    bio: body.bio || "",
    activeScore: Number(body.activeScore || 86),
    source: body.source || "管理员新增"
  };
}

function normalizeTechManager(body, id) {
  return {
    id,
    name: body.name || "",
    title: body.title || "",
    organization: body.organization || "",
    region: body.region || "",
    industries: body.industries || body.field || "",
    serviceTags: body.serviceTags || body.keywords || "",
    currentLoad: Number(body.currentLoad || 0),
    responseRate: Number(body.responseRate || 86),
    dealCount: Number(body.dealCount || 0),
    focus: body.focus || body.desc || "",
    order: Number(body.order || id)
  };
}

function normalizeMatch(body, id) {
  return {
    id,
    demandId: Number(body.demandId || 0),
    demandName: body.demandName || body.name || "",
    expertId: Number(body.expertId || 0),
    expertName: body.expertName || body.expert || "",
    field: body.field || "",
    score: Number(body.score || body.matchScore || 80),
    successScore: Number(body.successScore || body.successIndex || 72),
    reason: body.reason || "管理员维护的供需匹配记录",
    suggestion: body.suggestion || "建议进入需求复核、NDA、样件验证和合同条款确认。",
    order: Number(body.order || id),
    createdAt: body.createdAt || new Date().toISOString()
  };
}

function normalizeAgent(body, id) {
  return {
    id,
    name: body.name || "",
    nickname: body.nickname || body.name || "",
    role: body.role || "transferOfficer",
    category: body.category || "成果转化",
    avatar: body.avatar || String(body.nickname || body.name || "智").slice(0, 1),
    desc: body.desc || body.description || "",
    prompt: body.prompt || "",
    benchmark: body.benchmark || "",
    dataSet: body.dataSet || body.dataset || "",
    expectedEffect: body.expectedEffect || body.effect || "",
    demoQuestions: body.demoQuestions || body.qa || "",
    order: Number(body.order || id),
    enabled: body.enabled !== false
  };
}

function normalizeVideo(body, id) {
  return {
    id,
    title: body.title || body.name || "",
    category: body.category || "演示视频",
    cover: body.cover || "",
    url: body.url || "",
    desc: body.desc || body.description || "",
    order: Number(body.order || id),
    enabled: body.enabled !== false
  };
}

function mapImportRow(row) {
  const aliases = {
    name: ["name", "名称", "成果名称", "需求名称", "专家名称", "经理人名称", "标题"],
    title: ["title", "职称", "职务", "标题"],
    nickname: ["nickname", "昵称"],
    company: ["company", "企业", "企业名称", "所属单位或公司名称", "公司名称"],
    organization: ["organization", "单位", "机构", "完成单位", "所属单位", "服务机构"],
    field: ["field", "领域", "技术领域", "所属领域", "所属高新技术领域", "战略性新兴产业分类"],
    summary: ["summary", "简介", "成果简介", "摘要"],
    intro: ["intro", "专家介绍"],
    keywords: ["keywords", "关键词", "成果关键字", "专业特长"],
    technicalIndicators: ["technicalIndicators", "技术指标", "指标"],
    problem: ["problem", "技术难题", "拟解决的技术难题"],
    foundation: ["foundation", "现有基础条件", "基础条件"],
    region: ["region", "地区", "所属地区", "所属地域"],
    cooperation: ["cooperation", "合作方式", "拟采取的转化方式"],
    budgetText: ["budgetText", "预算金额", "预算资金"],
    demandType: ["demandType", "需求类型"],
    contact: ["contact", "联系人", "联系方式", "企业联系人", "复核人"],
    evidence: ["evidence", "补证材料", "佐证材料", "补证材料记录"],
    source: ["source", "信息来源", "来源"],
    industries: ["industries", "服务产业", "产业方向"],
    serviceTags: ["serviceTags", "服务标签", "服务能力"],
    focus: ["focus", "服务简介", "擅长方向"],
    desc: ["desc", "描述", "说明"],
    prompt: ["prompt", "提示词", "首句"],
    category: ["category", "分类", "类别"]
  };
  const normalized = {};
  Object.entries(row).forEach(([rawKey, value]) => {
    const key = String(rawKey || "").trim();
    const target = Object.entries(aliases).find(([, names]) => names.includes(key))?.[0] || key;
    normalized[target] = value;
  });
  return normalized;
}

function parseDelimitedText(text) {
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = splitDelimitedLine(lines[0], delimiter).map((item) => item.trim());
  return lines.slice(1).map((line) => {
    const cells = splitDelimitedLine(line, delimiter);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function splitDelimitedLine(line, delimiter) {
  if (delimiter === "\t") return line.split("\t");
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function sendJson(res, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  if (body.length >= 1024) {
    const compressed = zlib.gzipSync(body, { level: zlib.constants.Z_BEST_SPEED });
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Encoding": "gzip",
      "Content-Length": compressed.length,
      "Vary": "Accept-Encoding"
    });
    res.end(compressed);
    return;
  }
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5_000_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}

function buildDashboard(store) {
  const realCounts = {
    achievements: store.achievements.length,
    demands: store.demands.length,
    experts: store.experts.length,
    techManagers: (store.techManagers || []).length,
    matches: store.matches.length,
    conversations: store.conversations.length
  };
  return {
    achievements: realCounts.achievements,
    demands: DEMO_TOTALS.demands,
    experts: DEMO_TOTALS.experts,
    techManagers: DEMO_TOTALS.techManagers,
    matches: DEMO_TOTALS.matches,
    conversations: realCounts.conversations,
    realCounts,
    displayMode: "demo",
    latestMatches: store.matches.slice(-5).reverse(),
    activity: [
      { label: "本周新增需求", value: store.demands.length + 2 },
      { label: "专家响应率", value: "82%" },
      { label: "平均匹配度", value: store.matches.length ? `${Math.round(store.matches.reduce((sum, item) => sum + item.score, 0) / store.matches.length)}%` : "待生成" },
      { label: "长三角协作", value: "7项" }
    ]
  };
}

function scoreTechManagers(demand, managers) {
  const demandText = `${demand.name} ${demand.field} ${demand.problem} ${demand.technicalIndicators} ${demand.region} ${demand.keywords}`.toLowerCase();
  return (managers || [])
    .map((manager) => {
      const managerText = `${manager.industries} ${manager.serviceTags} ${manager.focus} ${manager.region}`.toLowerCase();
      const fieldHit = managerText.includes(String(demand.field || "").toLowerCase()) ? 34 : 0;
      const tokenHits = String(demand.keywords || "")
        .split(/[，,、;；\s]+/)
        .filter(Boolean)
        .reduce((sum, token) => sum + (managerText.includes(token.toLowerCase()) ? 6 : 0), 0);
      const regionHit = /长三角|上海|江苏|浙江|安徽/.test(`${demand.region} ${manager.region}`) ? 16 : 0;
      const response = Math.round(Number(manager.responseRate || 80) * 0.22);
      const workload = Math.max(0, 14 - Number(manager.currentLoad || 0));
      const demandHint = demandText.includes("合同") || demandText.includes("供应") ? 6 : 0;
      const score = Math.max(62, Math.min(98, fieldHit + tokenHits + regionHit + response + workload + demandHint));
      return {
        ...manager,
        recommendScore: score,
        reason: [
          fieldHit ? "产业方向匹配" : "可作为跨领域协同经理人",
          regionHit ? "具备长三角跨区域服务半径" : "可远程承接撮合",
          Number(manager.currentLoad || 0) <= 5 ? "当前任务负载适中" : "已有多项在办任务但响应率稳定"
        ].join("；")
      };
    })
    .sort((a, b) => b.recommendScore - a.recommendScore);
}

function buildManagerTasks(demand, store) {
  const experts = scoreExperts(demand, store.experts || []).slice(0, 3);
  return [
    { step: "需求复核", status: "今日待办", target: demand.name, output: "补齐技术指标、预算边界、验收方式和企业基础条件" },
    { step: "专家邀约", status: "智能体推荐", target: experts.map((item) => item.name).join("、") || "待推荐专家", output: "向专家发送需求摘要、NDA提示和首轮访谈问题" },
    { step: "预沟通纪要", status: "可生成", target: "科小企 × 科小专", output: "模拟双方智能体对话，形成风险点、样件清单和下一步计划" },
    { step: "转化推进", status: "待确认", target: demand.cooperation || "合作方式待定", output: "整理技术合同要点、政策申报机会和基金对接建议" }
  ];
}

function canAccessConversation(user, room, store) {
  if (user.role === "admin" || user.role === "manager") return true;
  const demand = store.demands.find((item) => item.id === room.demandId);
  const expert = store.experts.find((item) => item.id === room.expertId);
  if (user.role === "enterprise") return room.enterpriseUserId === user.id || demand?.publisherId === user.id || demand?.company === user.name;
  if (user.role === "expert") return room.expertUserId === user.id || expert?.userId === user.id || expert?.name === user.name;
  return false;
}

function decorateConversation(room, store) {
  const demand = store.demands.find((item) => item.id === room.demandId) || {};
  const expert = store.experts.find((item) => item.id === room.expertId) || {};
  const messages = store.messages.filter((item) => item.conversationId === room.id);
  const match = demand.id && expert.id ? scoreExperts(demand, [expert])[0] : null;
  return {
    ...room,
    demand,
    expert,
    matchScore: match?.matchScore || 0,
    matchReason: match?.reason || "等待补充画像后重新计算",
    lastMessage: messages[messages.length - 1] || null,
    messageCount: messages.length
  };
}

function inferNextNegotiationAgent(history) {
  const last = history[history.length - 1]?.sender || "";
  if (last === "enterpriseAgent" || last === "enterprise") return "expertAgent";
  if (last === "expertAgent" || last === "expert") return "enterpriseAgent";
  return "enterpriseAgent";
}

function buildNegotiationPrompt(agentRole, demand, expert, history) {
  const speaker = agentRole === "expertAgent" ? "科小专（专家方智能体）" : agentRole === "managerAgent" ? "科小经（技术经理人智能体）" : agentRole === "enterpriseCompanion" ? "企专伴（企业成长陪伴智能体）" : "科小企（企业方智能体）";
  const task = agentRole === "expertAgent"
    ? "你要代表专家判断需求是否适合，回应技术可行性、成熟度、样件/数据要求、成本和交付风险。"
    : agentRole === "managerAgent"
      ? "你要代表技术经理人总结分歧、提出撮合下一步和需要双方确认的材料。"
      : agentRole === "enterpriseCompanion"
        ? "你要代表企业成长陪伴顾问，发现企业没有意识到的技术、知识产权、政策申报和专家咨询短板。"
      : "你要代表企业筛选专家是否合适，追问指标达成、产业化案例、预算、质量责任、知识产权和合作方式。";
  return [
    `你是${speaker}，正在一个真实供需一对一磋商室里发言。`,
    task,
    "请只输出你这一方的一条发言。不要一次性生成整段对话，不要写舞台说明。",
    "发言必须像真实商务/技术沟通：先回应上一句，再提出1-3个具体确认点。控制在90-180字。",
    `企业需求：${demand.name || "未命名需求"}；企业：${demand.company || "未知企业"}；领域：${demand.field || "未知领域"}；预算：${demand.budgetText || demand.budgetAmount || "未说明"}；指标：${demand.technicalIndicators || demand.detail || "未说明"}；难题：${demand.problem || "未说明"}`,
    `专家画像：${expert.name || "未知专家"}；单位：${expert.organization || "未知单位"}；领域：${expert.field || "未知领域"}；专长：${expert.keywords || expert.researchDirection || "未说明"}；成果/资质：${expert.achievements || expert.bio || "未说明"}`,
    "历史消息：",
    history.map((item) => `${item.speaker || item.sender}：${item.text}`).join("\n") || "暂无历史，请开场说明磋商目标。",
    "下一句："
  ].join("\n");
}

async function handleApi(req, res) {
  const store = readStore();
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await readBody(req);
    const user = store.users.find((item) => item.phone === body.phone && item.password === body.password);
    return user ? sendJson(res, 200, { user }) : sendJson(res, 401, { message: "手机号或密码不正确" });
  }

  if (req.method === "POST" && url.pathname === "/api/register") {
    const body = await readBody(req);
    const exists = store.users.some((item) => item.phone === body.phone);
    if (exists) return sendJson(res, 409, { message: "该手机号已注册" });
    const user = { id: nextId(store.users), name: body.name, role: body.role, phone: body.phone, password: body.password };
    store.users.push(user);
    writeStore(store);
    return sendJson(res, 201, { user });
  }

  if (req.method === "GET" && url.pathname === "/api/achievements") {
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const field = url.searchParams.get("field") || "";
    const achievements = store.achievements.filter((item) => {
      const haystack = `${item.name} ${item.summary} ${item.field} ${item.keywords}`.toLowerCase();
      return (!q || haystack.includes(q)) && (!field || item.field === field);
    });
    return sendJson(res, 200, { achievements });
  }

  if (req.method === "GET" && url.pathname === "/api/search") {
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const includesQuery = (...values) => values.some((value) => String(value || "").toLowerCase().includes(q));
    const achievements = q
      ? (store.achievements || []).filter((item) => includesQuery(item.name, item.summary, item.organization, item.field, item.keywords))
      : [];
    const demands = q
      ? (store.demands || []).filter((item) => includesQuery(item.name, item.company, item.detail, item.problem, item.field, item.region, item.keywords))
      : [];
    const experts = q
      ? (store.experts || []).filter((item) => includesQuery(item.name, item.organization, item.intro, item.bio, item.field, item.keywords, item.researchDirection))
      : [];
    return sendJson(res, 200, {
      query: q,
      counts: {
        achievements: achievements.length,
        demands: demands.length,
        experts: experts.length
      },
      achievements: achievements.slice(0, 12),
      demands: demands.slice(0, 12),
      experts: experts.slice(0, 12)
    });
  }

  if (req.method === "GET" && url.pathname === "/api/experts") {
    return sendJson(res, 200, { experts: store.experts });
  }

  if (req.method === "GET" && url.pathname === "/api/tech-managers") {
    return sendJson(res, 200, { techManagers: store.techManagers || [] });
  }

  if (req.method === "GET" && url.pathname === "/api/agents") {
    const agents = (store.agents || [])
      .filter((item) => item.enabled !== false)
      .sort((a, b) => Number(a.order || a.id || 0) - Number(b.order || b.id || 0));
    return sendJson(res, 200, { agents });
  }

  if (req.method === "GET" && url.pathname === "/api/admin/content") {
    return sendJson(res, 200, {
      achievements: store.achievements || [],
      demands: sortDemandsByAuthenticity(store.demands),
      experts: store.experts || [],
      techManagers: store.techManagers || [],
      matches: store.matches || [],
      agents: store.agents || [],
      videos: store.videos || []
    });
  }

  if (req.method === "GET" && url.pathname === "/api/demands") {
    return sendJson(res, 200, { demands: sortDemandsByAuthenticity(store.demands) });
  }

  if (req.method === "POST" && url.pathname === "/api/enterprise/profile") {
    const body = await readBody(req);
    const user = store.users.find((item) => item.id === Number(body.userId) && item.role === "enterprise");
    if (!user) return sendJson(res, 403, { message: "仅企业账号可维护企业介绍" });
    user.companyProfile = {
      company: body.company || user.name,
      industry: body.industry || "",
      region: body.region || "",
      scale: body.scale || "",
      intro: body.intro || "",
      contact: body.contact || "",
      updatedAt: new Date().toISOString()
    };
    writeStore(store);
    return sendJson(res, 200, { profile: user.companyProfile });
  }

  if (req.method === "POST" && url.pathname === "/api/expert/profile") {
    const body = await readBody(req);
    const user = store.users.find((item) => item.id === Number(body.userId) && item.role === "expert");
    if (!user) return sendJson(res, 403, { message: "仅专家账号可维护专家信息" });
    const existing = store.experts.find((item) => item.userId === user.id || item.name === body.name || item.name === user.name);
    const expert = normalizeExpert({ ...body, name: body.name || user.name, source: "专家自主发布" }, existing?.id || nextId(store.experts));
    expert.userId = user.id;
    if (existing) Object.assign(existing, expert);
    else store.experts.unshift(expert);
    user.expertProfileId = expert.id;
    writeStore(store);
    return sendJson(res, 200, { expert });
  }

  if (req.method === "POST" && url.pathname === "/api/expert/achievements") {
    const body = await readBody(req);
    const user = store.users.find((item) => item.id === Number(body.userId) && item.role === "expert");
    if (!user) return sendJson(res, 403, { message: "仅专家账号可发布成果" });
    const item = normalizeAchievement({
      ...body,
      completer: body.completer || user.name,
      contact: body.contact || user.name,
      source: "专家自主发布"
    }, nextId(store.achievements));
    if (!item.name) return sendJson(res, 400, { message: "成果名称不能为空" });
    item.publisherId = user.id;
    store.achievements.unshift(item);
    writeStore(store);
    return sendJson(res, 201, { achievement: item });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/workbench/")) {
    const userId = Number(url.pathname.split("/").pop());
    const user = store.users.find((item) => item.id === userId);
    if (!user) return sendJson(res, 404, { message: "用户不存在" });
    const myDemands = store.demands.filter((item) => item.publisherId === user.id || item.company === user.name).slice(-20).reverse();
    const myAchievements = store.achievements.filter((item) => item.publisherId === user.id || item.completer === user.name || item.contact === user.name).slice(0, 20);
    const recommendedDemand = store.demands.slice().reverse().find((item) => scoreTechManagers(item, store.techManagers || [])[0]?.name === user.name) || store.demands.slice().reverse()[0];
    const managerTasks = user.role === "manager" && recommendedDemand ? buildManagerTasks(recommendedDemand, store) : [];
    return sendJson(res, 200, {
      user,
      profile: user.companyProfile || null,
      myDemands,
      myAchievements,
      expert: store.experts.find((item) => item.userId === user.id || item.name === user.name) || null,
      managerTasks,
      stats: buildDashboard(store)
    });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/achievements") {
    const body = await readBody(req);
    if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
    const item = normalizeAchievement(body, nextId(store.achievements));
    if (!item.name) return sendJson(res, 400, { message: "成果名称不能为空" });
    store.achievements.unshift(item);
    writeStore(store);
    return sendJson(res, 201, { achievement: item });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/experts") {
    const body = await readBody(req);
    if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
    const item = normalizeExpert(body, nextId(store.experts));
    if (!item.name) return sendJson(res, 400, { message: "专家名称不能为空" });
    store.experts.unshift(item);
    writeStore(store);
    return sendJson(res, 201, { expert: item });
  }

  if (req.method === "POST" && url.pathname === "/api/admin/demands") {
    const body = await readBody(req);
    if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
    const item = normalizeDemand(body, nextId(store.demands));
    if (!item.name) return sendJson(res, 400, { message: "需求名称不能为空" });
    store.demands.push(item);
    writeStore(store);
    return sendJson(res, 201, { demand: item });
  }

  const adminCollectionMatch = url.pathname.match(/^\/api\/admin\/collections\/([^/]+)(?:\/(\d+)|\/import|\/reorder)?$/);
  if (adminCollectionMatch) {
    const type = adminCollectionMatch[1];
    const config = getCollectionConfig(type);
    if (!config) return sendJson(res, 404, { message: "未知管理对象" });
    if (!store[config.key]) store[config.key] = [];
    const target = store[config.key];

    if (req.method === "POST" && url.pathname.endsWith("/import")) {
      const body = await readBody(req);
      if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
      const rows = Array.isArray(body.rows) ? body.rows : parseDelimitedText(body.text);
      const imported = [];
      rows.map(mapImportRow).forEach((row) => {
        const item = config.normalizer(row, nextId(target));
        if (item[config.required]) {
          target.push(item);
          imported.push(item);
        }
      });
      writeStore(store);
      return sendJson(res, 201, { imported, count: imported.length });
    }

    if (req.method === "POST" && url.pathname.endsWith("/reorder")) {
      const body = await readBody(req);
      if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
      const id = Number(body.id);
      const direction = body.direction === "down" ? 1 : -1;
      const index = target.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= target.length) return sendJson(res, 200, { items: target });
      const [item] = target.splice(index, 1);
      target.splice(nextIndex, 0, item);
      target.forEach((entry, orderIndex) => { entry.order = orderIndex + 1; });
      writeStore(store);
      return sendJson(res, 200, { items: target });
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
      const item = config.normalizer(body, nextId(target));
      if (!item[config.required]) return sendJson(res, 400, { message: "名称不能为空" });
      target.unshift(item);
      writeStore(store);
      return sendJson(res, 201, { [config.singular]: item, item });
    }

    if (req.method === "PUT" && adminCollectionMatch[2]) {
      const body = await readBody(req);
      if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
      const id = Number(adminCollectionMatch[2]);
      const index = target.findIndex((item) => item.id === id);
      if (index === -1) return sendJson(res, 404, { message: "内容不存在" });
      target[index] = { ...target[index], ...config.normalizer({ ...target[index], ...body }, id), id };
      writeStore(store);
      return sendJson(res, 200, { [config.singular]: target[index], item: target[index] });
    }

    if (req.method === "DELETE" && adminCollectionMatch[2]) {
      const body = await readBody(req);
      if (body.adminRole !== "admin") return sendJson(res, 403, { message: "仅管理员可操作" });
      const id = Number(adminCollectionMatch[2]);
      const index = target.findIndex((item) => item.id === id);
      if (index === -1) return sendJson(res, 404, { message: "内容不存在" });
      const [deleted] = target.splice(index, 1);
      writeStore(store);
      return sendJson(res, 200, { deleted });
    }
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/manager-recommendations/")) {
    const demandId = Number(url.pathname.split("/").pop());
    const demand = store.demands.find((item) => item.id === demandId) || store.demands[0];
    const experts = demand ? scoreExperts(demand, store.experts).slice(0, 3) : [];
    const managers = demand ? scoreTechManagers(demand, store.techManagers).slice(0, 4) : [];
    const tasks = demand ? [
      { step: "需求复核", owner: managers[0]?.name || "待分配", status: "进行中", output: "把技术指标、预算、验收口径补成标准需求单" },
      { step: "专家邀约", owner: managers[1]?.name || managers[0]?.name || "待分配", status: "待启动", output: `优先邀约${experts[0]?.name || "匹配专家"}并确认可开放材料` },
      { step: "样件/尽调", owner: managers[2]?.name || managers[0]?.name || "待分配", status: "待启动", output: "组织样件测试、专利FTO、质量责任和交付节点评审" },
      { step: "合作推进", owner: managers[0]?.name || "待分配", status: "待启动", output: "形成对接纪要、技术合同条款和政策/基金申报清单" }
    ] : [];
    return sendJson(res, 200, { demand, experts, managers, tasks });
  }

  if (req.method === "POST" && url.pathname === "/api/demands") {
    const body = await readBody(req);
    const publisher = store.users.find((item) => item.id === Number(body.publisherId));
    if (!publisher || publisher.role !== "enterprise") {
      return sendJson(res, 403, { message: "仅企业账号可发布技术需求" });
    }
    const demand = normalizeDemand({ ...body, source: body.source || "企业自主发布" }, nextId(store.demands));
    demand.publisherId = publisher.id;
    demand.company = demand.company || publisher.companyProfile?.company || publisher.name;
    store.demands.push(demand);
    const ranked = scoreExperts(demand, store.experts).slice(0, 5);
    const complexity = analyzeDemandComplexity(demand);
    const needsManager = complexity.route === "manager-led" || ranked.some((expert) => expert.managerRecommended);
    const managers = needsManager ? scoreTechManagers(demand, store.techManagers).slice(0, 3) : [];
    ranked.forEach((expert) => {
      store.matches.push({
        id: nextId(store.matches),
        demandId: demand.id,
        demandName: demand.name,
        expertId: expert.id,
        expertName: expert.name,
        field: expert.field,
        score: expert.matchScore,
        reason: expert.reason,
        matchLevel: expert.matchLevel,
        matchLabel: expert.matchLabel,
        managerRecommended: expert.managerRecommended,
        recommendationRoute: expert.recommendationRoute,
        createdAt: new Date().toISOString()
      });
    });
    writeStore(store);
    return sendJson(res, 201, { demand, matches: ranked, complexity, managers });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/matches/")) {
    const demandId = Number(url.pathname.split("/").pop());
    const demand = store.demands.find((item) => item.id === demandId);
    if (!demand) return sendJson(res, 404, { message: "需求不存在" });
    const matches = scoreExperts(demand, store.experts).slice(0, 5);
    const complexity = analyzeDemandComplexity(demand);
    const needsManager = complexity.route === "manager-led" || matches.some((expert) => expert.managerRecommended);
    const managers = needsManager ? scoreTechManagers(demand, store.techManagers).slice(0, 3) : [];
    return sendJson(res, 200, { demand, matches, complexity, managers });
  }

  if (req.method === "POST" && url.pathname === "/api/conversations") {
    const body = await readBody(req);
    let conversation = body.reset || body.newRoom
      ? null
      : store.conversations.find((item) => item.demandId === body.demandId && item.expertId === body.expertId);
    if (!conversation) {
      const expert = store.experts.find((item) => item.id === body.expertId);
      const demand = store.demands.find((item) => item.id === body.demandId);
      conversation = {
        id: nextId(store.conversations),
        demandId: body.demandId,
        expertId: body.expertId,
        title: `${demand?.name || "需求"} / ${expert?.name || "专家"}`,
        status: "磋商中",
        mode: "human_agent_negotiation",
        enterpriseUserId: demand?.publisherId || 1,
        expertUserId: expert?.userId || store.users.find((item) => item.role === "expert" && item.name === expert?.name)?.id || 2,
        createdAt: new Date().toISOString()
      };
      store.conversations.push(conversation);
      store.messages.push({
        id: nextId(store.messages),
        conversationId: conversation.id,
        sender: "system",
        speaker: "平台撮合助手",
        text: "企业已授权平台发起推荐，供需磋商室已建立：企业方、专家方和双方智能体可围绕适配度、验证条件、成本、交付和合作模式逐轮沟通。",
        createdAt: new Date().toISOString()
      });
      store.messages.push({
        id: nextId(store.messages),
        conversationId: conversation.id,
        sender: "enterpriseAgent",
        speaker: "科小企",
        text: "企业侧已授权本次推荐。请专家侧智能体确认是否愿意进入技术指标、样件验证和合作边界沟通。",
        createdAt: new Date().toISOString()
      });
      store.messages.push({
        id: nextId(store.messages),
        conversationId: conversation.id,
        sender: "expertAgent",
        speaker: "科小专",
        text: "专家侧已收到推荐并同意进入预沟通。本轮先确认需求真实性、技术指标、样件条件、知识产权和保密边界。",
        createdAt: new Date().toISOString()
      });
      writeStore(store);
    }
    return sendJson(res, 201, { conversation });
  }

  if (req.method === "GET" && url.pathname === "/api/negotiation-rooms") {
    const userId = Number(url.searchParams.get("userId"));
    const user = store.users.find((item) => item.id === userId);
    if (!user) return sendJson(res, 404, { message: "用户不存在" });
    const rooms = store.conversations
      .filter((room) => canAccessConversation(user, room, store))
      .slice()
      .reverse()
      .map((room) => decorateConversation(room, store));
    return sendJson(res, 200, { rooms });
  }

  if (req.method === "POST" && url.pathname === "/api/negotiation-rooms/start") {
    const body = await readBody(req);
    const user = store.users.find((item) => item.id === Number(body.userId));
    if (!user) return sendJson(res, 404, { message: "用户不存在" });
    const demand = store.demands.find((item) => item.id === Number(body.demandId)) ||
      store.demands.find((item) => item.publisherId === user.id || item.company === user.name) ||
      store.demands.slice().reverse()[0];
    const expert = store.experts.find((item) => item.id === Number(body.expertId)) ||
      (user.role === "expert" ? store.experts.find((item) => item.userId === user.id || item.name === user.name) : null) ||
      (demand ? scoreExperts(demand, store.experts)[0] : null) ||
      store.experts[0];
    if (!demand || !expert) return sendJson(res, 400, { message: "缺少需求或专家，无法建立磋商室" });
    let conversation = body.reset || body.newRoom
      ? null
      : store.conversations.find((item) => item.demandId === demand.id && item.expertId === expert.id);
    if (!conversation) {
      conversation = {
        id: nextId(store.conversations),
        demandId: demand.id,
        expertId: expert.id,
        title: `${demand.name} / ${expert.name}`,
        status: "磋商中",
        mode: "human_agent_negotiation",
        enterpriseUserId: demand.publisherId || store.users.find((item) => item.role === "enterprise" && item.name === demand.company)?.id || 1,
        expertUserId: expert.userId || store.users.find((item) => item.role === "expert" && item.name === expert.name)?.id || 2,
        createdAt: new Date().toISOString()
      };
      store.conversations.push(conversation);
      store.messages.push({
        id: nextId(store.messages),
        conversationId: conversation.id,
        sender: "system",
        speaker: "平台撮合助手",
        text: "供需磋商室已建立。系统已同步需求画像、专家画像和匹配理由，建议先判断是否值得进入NDA和样件验证。",
        createdAt: new Date().toISOString()
      });
    }
    writeStore(store);
    return sendJson(res, 201, { room: decorateConversation(conversation, store) });
  }

  if (req.method === "POST" && url.pathname.match(/^\/api\/negotiation-rooms\/\d+\/messages$/)) {
    const body = await readBody(req);
    const roomId = Number(url.pathname.split("/")[3]);
    const user = store.users.find((item) => item.id === Number(body.userId));
    const room = store.conversations.find((item) => item.id === roomId);
    if (!room || !user || !canAccessConversation(user, room, store)) return sendJson(res, 403, { message: "无权访问该磋商室" });
    const message = {
      id: nextId(store.messages),
      conversationId: room.id,
      sender: user.role,
      speaker: user.role === "enterprise" ? "企业方" : user.role === "expert" ? "专家方" : user.role === "admin" ? "平台管理员" : user.name,
      text: body.text || "",
      createdAt: new Date().toISOString()
    };
    if (!message.text.trim()) return sendJson(res, 400, { message: "消息不能为空" });
    store.messages.push(message);
    writeStore(store);
    broadcastMessages(room.id);
    return sendJson(res, 201, { message });
  }

  if (req.method === "POST" && url.pathname.match(/^\/api\/negotiation-rooms\/\d+\/agent-step$/)) {
    const body = await readBody(req);
    const roomId = Number(url.pathname.split("/")[3]);
    const user = store.users.find((item) => item.id === Number(body.userId));
    const room = store.conversations.find((item) => item.id === roomId);
    if (!room || !user || !canAccessConversation(user, room, store)) return sendJson(res, 403, { message: "无权访问该磋商室" });
    const demand = store.demands.find((item) => item.id === room.demandId) || {};
    const expert = store.experts.find((item) => item.id === room.expertId) || {};
    const history = store.messages.filter((item) => item.conversationId === room.id).slice(-10);
    const nextAgent = body.agentRole || inferNextNegotiationAgent(history);
    const speaker = nextAgent === "expertAgent" ? "科小专" : nextAgent === "managerAgent" ? "科小经" : "科小企";
    const prompt = buildNegotiationPrompt(nextAgent, demand, expert, history);
    const modelResult = await callModel(prompt, { webSearch: Boolean(body.webSearch), searchQuery: `${demand.name || ""} ${expert.name || ""}` });
    const message = {
      id: nextId(store.messages),
      conversationId: room.id,
      sender: nextAgent,
      speaker,
      text: modelResult?.reply || buildSpecialistAnswer(nextAgent, demand.name || expert.name || "", store),
      modelReady: Boolean(modelResult?.reply),
      createdAt: new Date().toISOString()
    };
    store.messages.push(message);
    writeStore(store);
    broadcastMessages(room.id);
    return sendJson(res, 201, { message, room: decorateConversation(room, store) });
  }

  if (req.method === "POST" && url.pathname === "/api/agent-dialogs") {
    const body = await readBody(req);
    const defaultDemand = store.demands.find((item) => /无人装备|铝合金/.test(`${item.name} ${item.keywords}`)) || store.demands[0];
    const demand = store.demands.find((item) => item.id === Number(body.demandId)) || defaultDemand;
    const expert =
      store.experts.find((item) => item.id === Number(body.expertId)) ||
      store.experts.find((item) => /铝合金|Al-Zn-Mg/.test(`${item.keywords} ${item.bio}`)) ||
      scoreExperts(demand, store.experts)[0] ||
      store.experts[0];
    let conversation = store.conversations.find((item) => item.demandId === demand.id && item.expertId === expert.id);
    if (!conversation) {
      conversation = {
        id: nextId(store.conversations),
        demandId: demand.id,
        expertId: expert.id,
        title: `${demand.name} / ${expert.name}`,
        mode: "agent_to_agent",
        createdAt: new Date().toISOString()
      };
      store.conversations.push(conversation);
    }
    const script = buildAgentDialogue(demand, expert, conversation.id, store.messages);
    script.forEach((message) => store.messages.push(message));
    writeStore(store);
    broadcastMessages(conversation.id);
    return sendJson(res, 201, {
      conversation,
      messages: store.messages.filter((item) => item.conversationId === conversation.id)
    });
  }

  if (req.method === "POST" && url.pathname === "/api/agent-dialogs/next") {
    const body = await readBody(req);
    const defaultDemand = store.demands.find((item) => /无人装备|铝合金/.test(`${item.name} ${item.keywords}`)) || store.demands[0];
    const demand = store.demands.find((item) => item.id === Number(body.demandId)) || defaultDemand;
    const expert =
      store.experts.find((item) => item.id === Number(body.expertId)) ||
      store.experts.find((item) => /铝合金|Al-Zn-Mg/.test(`${item.keywords} ${item.bio}`)) ||
      scoreExperts(demand, store.experts)[0] ||
      store.experts[0];
    let conversation = body.conversationId && !body.reset
      ? store.conversations.find((item) => item.id === Number(body.conversationId))
      : null;
    if (!conversation) {
      conversation = {
        id: nextId(store.conversations),
        demandId: demand.id,
        expertId: expert.id,
        title: `${demand.name} / ${expert.name}`,
        mode: "staged_agent_to_agent",
        createdAt: new Date().toISOString()
      };
      store.conversations.push(conversation);
    }
    const script = buildAgentDialogue(demand, expert, conversation.id, []);
    const existing = store.messages.filter((item) => item.conversationId === conversation.id);
    const nextLine = script[existing.length % script.length];
    const modelPrompt = buildStagedNegotiationPrompt(demand, expert, existing, nextLine.sender);
    const shouldUseModel = existing.length > 0 && nextLine.sender !== "agent";
    const modelResult = shouldUseModel ? await callModel(modelPrompt, {
      webSearch: Boolean(body.webSearch),
      searchQuery: `${demand.name || ""} ${expert.name || ""} Al-Zn-Mg 无人装备`
    }) : null;
    const message = {
      ...nextLine,
      id: nextId(store.messages),
      conversationId: conversation.id,
      text: modelResult?.reply || nextLine.text,
      modelReady: Boolean(modelResult?.reply),
      createdAt: new Date().toISOString()
    };
    store.messages.push(message);
    writeStore(store);
    broadcastMessages(conversation.id);
    return sendJson(res, 201, {
      conversation,
      message,
      done: existing.length + 1 >= script.length,
      messages: store.messages.filter((item) => item.conversationId === conversation.id)
    });
  }

  if (req.method === "POST" && url.pathname === "/api/agent-answer") {
    const body = await readBody(req);
    const prompt = buildAgentPrompt(body.role, body.text || "", store);
    const modelResult = await callModel(prompt, { webSearch: Boolean(body.webSearch), searchQuery: body.text || "" });
    return sendJson(res, 200, {
      role: body.role || "transferOfficer",
      reply: modelResult?.reply || buildSpecialistAnswer(body.role, body.text || "", store),
      model: modelResult?.model || "local-fallback",
      provider: modelResult?.provider || "local",
      modelReady: Boolean(modelResult?.reply)
    });
  }

  if (req.method === "POST" && url.pathname === "/api/role-agent-dialogue/next") {
    const body = await readBody(req);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const demand = store.demands.find((item) => item.id === Number(body.demandId)) || store.demands.slice().reverse()[0] || {};
    const role = body.role || "enterpriseAgent";
    const speakerName = role === "expertAgent" ? "科小专" : role === "managerAgent" ? "科小经" : role === "enterpriseCompanion" ? "企专伴" : "科小企";
    const prompt = [
      `你是${speakerName}，正在进行科技成果转化平台里的多智能体业务洽谈。`,
      "请只输出一段你的发言，不要写旁白，不要一次性结束对话。",
      "发言要像真实业务沟通：有追问、有让步、有确认事项，控制在80-150字。",
      `当前需求：${demand.name || "企业技术需求"}；企业：${demand.company || "待确认"}；领域：${demand.field || "待确认"}；指标：${demand.technicalIndicators || demand.detail || "待补充"}`,
      "上一轮对话：",
      history.map((item) => `${item.speaker}：${item.text}`).join("\n") || "尚未开始。请先开场。",
      "请生成下一句。"
    ].join("\n");
    const modelResult = await callModel(prompt, { webSearch: Boolean(body.webSearch), searchQuery: demand.name || body.text || "" });
    return sendJson(res, 200, {
      speaker: speakerName,
      role,
      text: modelResult?.reply || buildSpecialistAnswer(role, body.text || demand.name || "", store),
      modelReady: Boolean(modelResult?.reply),
      provider: modelResult?.provider || "local",
      model: modelResult?.model || "local-fallback"
    });
  }

  if (req.method === "GET" && url.pathname === "/api/model-status") {
    const provider = getModelProvider();
    return sendJson(res, 200, {
      modelReady: Boolean(provider),
      provider: provider?.name || "local",
      model: provider?.model || "未配置真实模型 API Key"
    });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/conversations/")) {
    const conversationId = Number(url.pathname.split("/").pop());
    const conversation = store.conversations.find((item) => item.id === conversationId);
    const messages = store.messages.filter((item) => item.conversationId === conversationId);
    return conversation ? sendJson(res, 200, { conversation, messages }) : sendJson(res, 404, { message: "会话不存在" });
  }

  if (req.method === "GET" && url.pathname === "/api/dashboard") {
    return sendJson(res, 200, buildDashboard(store));
  }

  return sendJson(res, 404, { message: "接口不存在" });
}

function buildAgentPrompt(role, text, store) {
  const roleMap = {
    generalAgent: "科小果：平台总智能体，负责统一问答、联网检索、任务路由和领导演示模式讲解。",
    transferOfficer: "成果转化官：理解科技成果，生成结构化画像，并匹配潜在企业。",
    demandAnalyst: "需求解析师：拆解企业模糊需求，输出标准化需求单和追问清单。",
    patentHunter: "专利猎手：做专利检索思路、侵权风险、可专利性和FTO初评。",
    policyAdvisor: "政策顾问：解读科技政策、补贴方向，生成申报材料草稿。",
    dueDiligence: "技术尽调助手：分析技术可行性、量产风险、商业化路径和验证计划。",
    financingOfficer: "投融资对接官：匹配科创基金、产业资本和融资材料重点。",
    enterpriseAgent: "科小企：企业专属智能体，帮助企业介绍自身能力、登记技术需求、追问专家并推动需求转化。",
    enterpriseCompanion: "企专伴：企业成长陪伴智能体，帮助企业发现隐性技术需求、申报认定短板、产品迭代空间和专家咨询机会，陪伴企业从科技型中小企业、高企、创新型中小企业、专精特新到潜在独角兽逐级成长。",
    expertAgent: "科小专：专家专属智能体，帮助专家沉淀专家画像、包装科技成果、回应企业技术问题。",
    managerAgent: "科小经：技术经理人专属智能体，帮助经理人拆解撮合任务、生成访谈提纲、对接纪要和推进计划。"
  };
  const trainedAgent = (store.agents || []).find((item) => item.role === role || item.id === role || item.nickname === role);
  const trainedProfile = trainedAgent ? [
    `智能体名称：${trainedAgent.nickname || trainedAgent.name} / ${trainedAgent.name}`,
    `能力说明：${trainedAgent.desc || "按平台默认能力执行"}`,
    `对标对象：${trainedAgent.benchmark || "科技成果转化业务专家"}`,
    `训练/知识数据集：${trainedAgent.dataSet || "成果库、需求库、专家库、技术经理人库、政策资金规则和磋商记录"}`,
    `预期效果：${trainedAgent.expectedEffect || "输出可执行、可复核、可落地的转化建议"}`,
    `系统提示词：${trainedAgent.prompt || roleMap[role] || roleMap.transferOfficer}`,
    trainedAgent.demoQuestions ? `演示问答脚本：${trainedAgent.demoQuestions}` : ""
  ].filter(Boolean).join("\n") : "";
  const demands = store.demands.slice(0, 5).map((item) => `需求：${item.name}；企业：${item.company}；领域：${item.field}；指标：${item.technicalIndicators}`).join("\n");
  const achievements = store.achievements.slice(0, 5).map((item) => `成果：${item.name}；单位：${item.organization}；领域：${item.field}；关键词：${item.keywords}`).join("\n");
  return [
    "你是科技成果转化平台里的专业智能体。",
    `你的角色是：${roleMap[role] || roleMap.transferOfficer}`,
    trainedProfile ? `后台已训练配置：\n${trainedProfile}` : "",
    "回答要像真实业务顾问，不能机械模板化。要结合用户问题和平台数据，给出可执行建议。",
    "请用中文，结构清晰，控制在180-320字。如果需要追问，最多提出3个关键问题。",
    "平台当前数据：",
    demands,
    achievements,
    `用户问题：${text}`
  ].join("\n");
}

function callModel(prompt, options = {}) {
  const provider = getModelProvider();
  if (!provider) return Promise.resolve(null);
  const model = options.webSearch && provider.name === "zhipu" ? ZHIPU_SEARCH_MODEL : provider.model;
  const payload = {
    model,
    messages: [
      { role: "system", content: "你是严谨、专业、懂科技成果转化的产业智能体。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.75
  };
  if (options.webSearch && provider.name === "zhipu") {
    payload.tools = [
      {
        type: "web_search",
        web_search: {
          enable: true,
          search_query: String(options.searchQuery || "").slice(0, 120),
          search_result: true
        }
      }
    ];
  }
  const body = JSON.stringify(payload);
  return new Promise((resolve) => {
    const req = https.request({
      hostname: provider.hostname,
      path: provider.path,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      },
      timeout: 15000
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const reply = parsed.choices?.[0]?.message?.content || null;
          resolve(reply ? { reply, model, provider: provider.name } : null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.write(body);
    req.end();
  });
}

function getModelProvider() {
  const zhipuKey = process.env.ZHIPU_API_KEY || process.env.ZHIPUAI_API_KEY;
  if (zhipuKey) {
    return {
      name: "zhipu",
      model: ZHIPU_MODEL,
      apiKey: zhipuKey,
      hostname: "open.bigmodel.cn",
      path: "/api/paas/v4/chat/completions"
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      name: "openai",
      model: OPENAI_MODEL,
      apiKey: process.env.OPENAI_API_KEY,
      hostname: "api.openai.com",
      path: "/v1/chat/completions"
    };
  }
  return null;
}

function buildSpecialistAnswer(role, text, store) {
  const normalized = String(text || "").trim();
  const aluminumDemand = store.demands.find((item) => /无人装备|铝合金/.test(`${item.name} ${item.keywords}`));
  const aluminumExpert = store.experts.find((item) => /铝合金|Al-Zn-Mg/.test(`${item.keywords} ${item.bio}`));
  const contextLine = aluminumDemand
    ? `当前可引用案例：《${aluminumDemand.name}》，企业为${aluminumDemand.company}，预算约${Math.round(aluminumDemand.budgetAmount / 10000)}万元。`
    : "当前可引用平台案例较少，建议先补充需求名称、指标、预算和合作方式。";
  const answers = {
    generalAgent: `科小果：我会先判断你的问题属于成果、需求、专家、经理人、政策资金还是投融资，再调用对应智能体协作。针对“${normalized}”，建议演示闭环这样走：企业登记需求，需小析补齐字段并评分，果小转/科小专给出专家成果匹配，科小经拉入磋商，策小通和融小桥补政策资金，最后生成转化撮合报告。`,
    transferOfficer: `成果转化官：我会先把成果拆成“技术指标、成熟度、知识产权、样件条件、转化方式、目标企业”六类画像。${contextLine}${aluminumExpert ? ` 可优先匹配${aluminumExpert.name}及其Al-Zn-Mg材料方向。` : ""}针对你的问题“${normalized}”，建议下一步生成成果画像并推送给3类企业：无人装备、近海装备、轻量化结构件制造商。`,
    demandAnalyst: `需求解析师：我会把这句话标准化成需求单。关键字段包括应用场景、性能指标、约束条件、年采购量、验证条件、预算和有效期。你的输入是“${normalized}”，建议补充：抗拉强度、盐雾小时数、焊接工艺、供应周期、质量责任边界。`,
    patentHunter: `专利猎手：我会围绕关键词做检索式：("Al-Zn-Mg" OR 高强铝合金) AND (无人装备 OR marine OR UAV) AND (corrosion OR impact)。初步判断要重点排查成分配比、过渡族元素添加、热处理工艺和应用场景权利要求。`,
    policyAdvisor: `政策顾问：这类项目可关注科技成果转化、长三角产业协同、首台套/首批次新材料、专精特新和低空经济政策。申报材料草稿建议包括项目背景、技术先进性、应用场景、经济效益、知识产权和示范单位。`,
    dueDiligence: `技术尽调助手：我会从TRL成熟度、中试批次稳定性、成本曲线、质量体系、替代竞品和商业化路径六项评分。对“${normalized}”，最关键风险是中试到量产的一致性、盐雾/疲劳长期数据和焊接热影响区强度保留率。`,
    financingOfficer: `投融资对接官：这类项目适合匹配新材料基金、低空经济产业基金、军民融合方向基金和地方成果转化引导基金。建议准备融资版BP：市场规模、客户订单、产能计划、单吨毛利、专利壁垒和试用客户名单。`,
    enterpriseAgent: `科小企：我会站在企业侧处理“${normalized}”。建议先补齐企业介绍、应用场景、技术指标、预算区间、验收方式和可开放数据样品；随后由我向科小专发起首轮追问，重点确认成熟度、成本、交付周期和质量责任。`,
    enterpriseCompanion: `企专伴：我会把企业成长当成“升级路线图”来诊断。针对“${normalized}”，建议先做五项体检：1. 技术与产线短板，找出产品性能、良率、能耗、自动化和数字化升级空间；2. 知识产权体检，判断是否缺专利、软著、标准或成果评价；3. 政策资质路径，按科技型中小企业、高企、创新型中小企业、专精特新、潜在独角兽逐级核对缺口；4. 外部专家补位，匹配材料、工艺、装备、质量、市场细分专家；5. 政府服务建议，把企业真实问题转成可申报、可撮合、可验收的项目包。`,
    expertAgent: `科小专：我会站在专家侧处理“${normalized}”。建议先把专家画像、代表成果、技术指标、知识产权、样件条件和可合作方式结构化；面对企业提问时，优先回答可验证数据、风险边界和下一步验证方案。`,
    managerAgent: `科小经：我会站在技术经理人侧处理“${normalized}”。建议把任务拆成需求复核、专家邀约、样件/数据清单、NDA与合同要点、政策基金机会五步，并为每一步指定负责人和截止时间。`
  };
  return answers[role] || answers.transferOfficer;
}

function buildAgentDialogue(demand, expert, conversationId, messages) {
  if (/无人装备|铝合金|Al-Zn-Mg/.test(`${demand.name} ${demand.keywords} ${expert.keywords}`)) {
    return buildAluminumDialogue(demand, expert, conversationId, messages);
  }
  const baseId = nextId(messages);
  const now = Date.now();
  const lines = [
    ["enterpriseAgent", `企业智能体：我代表${demand.company}发起技术需求《${demand.name}》。核心难题是：${demand.problem}`],
    ["expertAgent", `专家智能体：已读取需求画像。${expert.name}在${expert.field}方向与关键词“${expert.keywords.split(",").slice(0, 3).join("、")}”高度相关，可先核验数据基础。`],
    ["enterpriseAgent", `企业智能体：当前基础条件为：${trimEndPunctuation(demand.foundation)}。预算约${Math.round(demand.budgetAmount / 10000)}万元，倾向${demand.cooperation}。`],
    ["expertAgent", `专家智能体：建议第一阶段用2周完成样本数据审查和指标拆解，第二阶段做小样验证，验收重点对应“${trimEndPunctuation(demand.technicalIndicators)}”。`],
    ["enterpriseAgent", `企业智能体：请给出可转化路径和下一步材料清单。`],
    ["expertAgent", `专家智能体：路径建议为“需求澄清-保密协议-样本验证-联合开发合同-示范应用”。材料包括数据字典、现场照片、历史故障或测试记录、预算边界和知识产权要求。`],
    ["agent", "平台撮合智能体：本轮自动对话已生成初步合作纪要，可进入人工确认或继续由双方智能体追问技术细节。"]
  ];
  return lines.map(([sender, text], index) => ({
    id: baseId + index,
    conversationId,
    sender,
    text,
    createdAt: new Date(now + index * 1000).toISOString()
  }));
}

function buildAluminumDialogue(demand, expert, conversationId, messages) {
  const baseId = nextId(messages);
  const now = Date.now();
  const lines = [
    ["lobsterDemand", "科小果-需求方：各位专家好。我们是无人装备平台制造企业，正在寻找新一代特种铝合金材料，用于高端无人机和无人艇平台。核心需求包括抗拉强度≥450MPa、良好延伸率、动态冲击性能、近海高盐雾耐腐蚀、易加工焊接，以及尽可能轻量化。请问贵团队的Al-Zn-Mg合金是否能满足这些要求？成熟度如何？"],
    ["lobsterExpert", "科小果-专家方：感谢信任。我们的Al-Zn-Mg方案面向无人装备轻量化结构件设计，抗拉强度可达到450MPa以上，屈服强度≥380MPa，延伸率≥7%，厚度方向压缩强度可达600MPa以上；盐雾试验目标可达1000小时无明显腐蚀，并支持MIG/TIG焊接。"],
    ["lobsterDemand", "科小果-需求方：听起来不错。但我们要确认五个问题：产业化成熟度是实验室还是中试？与7075相比成本差异多大？大批量生产时成分均一性如何保证？对标军工级7075-T73优势在哪里？专利许可和侵权风险如何处理？"],
    ["lobsterExpert", "科小果-专家方：成熟度方面，小试已完成，中试正在进行，预计6个月内完成稳定中试验证；成本方面初期目标价约140到160元/kg，比7075-T73高10%到15%，产能放大后有望下降到120到130元/kg。工艺上用实时监控、自动配料和三层检测控制批次稳定性。"],
    ["lobsterDemand", "科小果-需求方：我们还关心质量责任、供应链、技术服务和合作模式。如果材料在无人装备中出现裂纹或断裂，责任如何界定？板材规格能否定制？是否提供焊接工艺培训？能否签长期供应协议？"],
    ["lobsterExpert", "科小果-专家方：质量方面建议合同约定3年质量保证期，若材料本身成分或力学性能不达标，可100%退换；若涉及设计、加工或使用环境，则双方联合失效分析。规格可按月计划定制多厚度板材，也可提供焊接参数窗口、热处理建议和工程师培训。"],
    ["lobsterDemand", "科小果-需求方：我们希望先小批量试用，验证无人艇结构件的盐雾、疲劳和焊接性能。如果样件通过，再进入长期供应和联合开发。请确认样件周期、检测报告、知识产权和专利许可边界。"],
    ["lobsterExpert", "科小果-专家方：建议先签NDA和样品试用合同，4到6周完成多厚度样件、盐雾/疲劳/焊接验证和检测报告。采购材料产品无需额外支付专利许可费，联合开发形成的新应用成果可另行约定权属。"],
    ["agent", "平台撮合智能体：匹配结论：需求方关注轻量化、抗冲击和耐盐雾；专家方成果具备材料指标、工艺路线和中试基础。建议进入“样件试制+焊接工艺验证+盐雾/疲劳测试”的联合验证阶段，并生成对接纪要。"]
  ];
  return lines.map(([sender, text], index) => ({
    id: baseId + index,
    conversationId,
    sender,
    text,
    createdAt: new Date(now + index * 1000).toISOString()
  }));
}

function buildStagedNegotiationPrompt(demand, expert, history, nextSender) {
  const isDemand = /demand|enterprise/.test(nextSender);
  const isPlatform = nextSender === "agent";
  const speaker = isPlatform ? "平台撮合智能体" : isDemand ? "需求方智能体" : "专家方智能体";
  const roleInstruction = isPlatform
    ? "你要输出阶段性撮合结论，说明匹配度、风险、下一步材料清单。"
    : isDemand
      ? "你代表无人装备制造企业，像真实采购和技术负责人一样追问：指标、成本、成熟度、量产、质量责任、供应链、知识产权。"
      : "你代表铝合金材料研发团队，像真实技术负责人一样回答：技术指标、验证数据、成本边界、供应能力、风险承担和合作方式。";
  return [
    `你是${speaker}，正在一对一技术磋商。`,
    roleInstruction,
    "只输出本轮这一句发言，不要写阶段标题，不要一次性完成整场谈判。",
    "语气要专业、自然，像真人会议发言；控制在90-180字。",
    "如果上一轮已有明确问题，要先回应，再提出一个推进合作的追问或确认事项。",
    `企业需求：${demand.name || "无人装备高强耐蚀轻量化铝合金材料"}`,
    `企业：${demand.company || "长三角无人装备制造有限公司"}`,
    `技术指标：${demand.technicalIndicators || demand.detail || "抗拉强度≥450MPa、盐雾1000小时、动态冲击、焊接加工、轻量化"}`,
    `专家/成果方：${expert.name || "铝合金材料研发团队"}；单位：${expert.organization || ""}；方向：${expert.field || ""}；关键词：${expert.keywords || ""}`,
    "已有对话：",
    history.slice(-8).map((item) => `${item.speaker || item.sender}：${item.text}`).join("\n") || "尚未开始，请做开场。",
    `现在轮到：${speaker}`
  ].join("\n");
}

function trimEndPunctuation(text) {
  return String(text || "").replace(/[。！？.!?]+$/g, "");
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch((error) => sendJson(res, 500, { message: error.message }));
    return;
  }
  serveStatic(req, res);
});

const sockets = new Set();

server.on("upgrade", (req, socket) => {
  if (!req.url.startsWith("/ws")) {
    socket.destroy();
    return;
  }
  const key = req.headers["sec-websocket-key"];
  const accept = crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "",
    ""
  ].join("\r\n"));
  sockets.add(socket);
  socket.on("data", (buffer) => handleSocketFrame(socket, buffer));
  socket.on("close", () => sockets.delete(socket));
  socket.on("error", () => sockets.delete(socket));
});

function decodeFrame(buffer) {
  const length = buffer[1] & 127;
  const maskStart = length === 126 ? 4 : length === 127 ? 10 : 2;
  const payloadLength = length === 126 ? buffer.readUInt16BE(2) : length;
  const masks = buffer.slice(maskStart, maskStart + 4);
  const data = buffer.slice(maskStart + 4, maskStart + 4 + payloadLength);
  return Buffer.from(data.map((byte, index) => byte ^ masks[index % 4])).toString("utf8");
}

function encodeFrame(message) {
  const payload = Buffer.from(message);
  const header = payload.length < 126 ? Buffer.from([129, payload.length]) : Buffer.from([129, 126, payload.length >> 8, payload.length & 255]);
  return Buffer.concat([header, payload]);
}

function broadcastMessages(conversationId) {
  const store = readStore();
  const messages = store.messages.filter((item) => item.conversationId === conversationId);
  const frame = encodeFrame(JSON.stringify({ type: "messages", conversationId, messages }));
  sockets.forEach((client) => client.write(frame));
}

function handleSocketFrame(socket, buffer) {
  try {
    const payload = JSON.parse(decodeFrame(buffer));
    const store = readStore();
    const message = {
      id: nextId(store.messages),
      conversationId: Number(payload.conversationId),
      sender: payload.sender || "enterprise",
      text: payload.text,
      createdAt: new Date().toISOString()
    };
    store.messages.push(message);
    if (message.sender !== "agent" && /预算|指标|样品|数据|合作/.test(message.text)) {
      store.messages.push({
        id: nextId(store.messages),
        conversationId: message.conversationId,
        sender: "agent",
        text: "智能体反馈：这条消息包含关键合作要素，建议在下一轮补充验收指标和时间节点。",
        createdAt: new Date().toISOString()
      });
    }
    writeStore(store);
    broadcastMessages(message.conversationId);
  } catch (error) {
    socket.write(encodeFrame(JSON.stringify({ type: "error", message: error.message })));
  }
}

ensureStore();
server.listen(PORT, HOST, () => {
  console.log(`科技成果转化平台运行中：http://${HOST}:${PORT}`);
});
