import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/macbookpro/Documents/New project/outputs";
const outputPath = `${outputDir}/企业需求评分演示样例.xlsx`;

const rows = [
  {
    version: "版本1",
    band: "D/C档",
    score: "35-50",
    title: "高端装备材料升级",
    company: "豫创装备有限公司",
    field: "智能制造",
    region: "国内",
    indicators: "希望材料更轻、更结实、更耐用，适合无人机和无人艇使用。",
    problem: "目前材料性能不够好，希望找专家合作解决。",
    foundation: "公司有相关产品和生产经验。",
    budget: 1000000,
    amount: 1000000,
    mode: "联合开发",
    nature: "民营企业",
    type: "技术攻关",
    deadline: "2026/12/31",
    source: "企业自主发布",
    keywords: "材料升级，无人装备，轻量化",
    demoPoint: "内容空泛、无明确指标、无真实场景，演示低质量/高风险需求。",
  },
  {
    version: "版本2",
    band: "B档低段",
    score: "60-68",
    title: "无人装备用轻量化铝合金材料开发",
    company: "豫创装备有限公司",
    field: "智能制造",
    region: "国内",
    indicators:
      "拟开发适用于无人机、无人艇结构件的轻量化铝合金材料，要求抗拉强度达到450MPa以上，材料具备一定耐腐蚀性能，能够满足复杂环境下长期使用需求。",
    problem:
      "现有铝合金材料在强度、耐腐蚀性和加工性能之间难以兼顾。企业希望通过专家合作，提升材料强度和耐盐雾能力，同时降低装备重量。",
    foundation:
      "公司现有无人装备结构件加工业务，具备机加工和装配能力，有一定铝合金零部件使用经验，但尚未建立系统的新材料研发团队。",
    budget: 1000000,
    amount: 1000000,
    mode: "联合开发",
    nature: "民营企业",
    type: "技术攻关",
    deadline: "2026/12/31",
    source: "企业自主发布",
    keywords: "铝合金，无人装备，轻量化，耐腐蚀",
    demoPoint: "基本可信，但指标和基础不够充分，演示及格但需补充。",
  },
  {
    version: "版本3",
    band: "B档中高段",
    score: "70-78",
    title: "无人装备用高强耐蚀轻量化铝合金材料开发",
    company: "豫创装备有限公司",
    field: "智能制造",
    region: "国内",
    indicators:
      "1. 抗拉强度≥450MPa；\n2. 屈服强度≥380MPa；\n3. 延伸率≥7%；\n4. 中性盐雾试验≥720小时无明显腐蚀；\n5. 材料密度控制在2.80g/cm³以下；\n6. 满足常规机加工和焊接工艺要求。",
    problem:
      "公司现有无人机、无人艇结构件主要采用常规6系和7系铝合金，在高盐雾、强振动和动态冲击环境下，存在腐蚀加快、焊接后强度衰减、结构件疲劳寿命不足等问题。希望联合高校或科研院所开发兼具高强度、耐腐蚀和可加工性能的新型铝合金材料。",
    foundation:
      "公司现有员工120人，其中研发和工艺人员18人。具备无人机机体结构件、无人艇壳体连接件加工经验，拥有CNC加工中心、焊接设备、三坐标检测设备和基础力学检测能力。已完成2款无人平台结构件小批量生产。",
    budget: 1500000,
    amount: 1500000,
    mode: "联合开发",
    nature: "民营企业",
    type: "技术攻关",
    deadline: "2026/12/31",
    source: "企业自主发布",
    keywords: "高强铝合金，耐盐雾，无人机，无人艇，结构轻量化",
    demoPoint: "指标较清楚、基础较可信，演示良好需求。",
  },
  {
    version: "版本4",
    band: "A档",
    score: "82-88",
    title: "面向无人机与无人艇平台的Al-Zn-Mg高强耐蚀轻量化铝合金材料开发",
    company: "豫创装备有限公司",
    field: "智能制造",
    region: "国内",
    indicators:
      "1. 抗拉强度≥450MPa，屈服强度≥380MPa，延伸率≥7%；\n2. 厚度方向压缩强度≥600MPa；\n3. 动态冲击性能满足10³-10⁴/S应变率条件下结构件抗冲击要求；\n4. 中性盐雾试验≥1000小时，腐蚀速率≤0.01mm/年；\n5. 焊接热影响区强度保持率≥85%；\n6. 材料密度≤2.80g/cm³；\n7. 形成1套材料成分及热处理工艺规范，申请发明专利1-2项。",
    problem:
      "企业现有无人机机臂、无人艇连接框架和承力结构件在近海高盐雾、高湿热、强振动环境下存在三类问题：一是常规7075铝合金耐腐蚀性不足，维护周期短；二是焊接和热处理后局部强度下降，影响结构可靠性；三是结构件减重需求强，但强度和韧性同步提升难度较大。希望通过Al-Zn-Mg合金成分优化、微合金化强化、晶粒细化和热处理工艺优化，开发可用于无人装备结构件的新材料及中试工艺。",
    foundation:
      "公司现有员工180人，研发和工艺人员32人。已建成无人装备结构件加工车间6000平方米，拥有五轴加工中心、自动焊接设备、热处理炉、三坐标测量仪、盐雾试验箱、万能材料试验机等设备。公司已完成3型无人机和2型无人艇结构件批量配套，近两年在轻量化结构设计方面投入研发经费约600万元。当前已有7075、6061材料应用数据和失效样件，可提供专家团队开展检测分析和工艺验证。",
    budget: 3000000,
    amount: 3000000,
    mode: "联合开发",
    nature: "民营企业",
    type: "技术攻关",
    deadline: "2026/12/31",
    source: "企业自主发布",
    keywords: "Al-Zn-Mg，高强韧铝合金，无人装备，耐盐雾，动态冲击，焊接性能",
    demoPoint: "高可信需求，适合展示专家匹配和技术经理人介入。",
  },
  {
    version: "版本5",
    band: "A档高分",
    score: "90-96",
    title: "复杂海洋环境无人装备用Al-Zn-Mg高强韧耐蚀铝合金材料及结构件中试开发",
    company: "豫创装备有限公司",
    field: "智能制造",
    region: "国内",
    indicators:
      "1. 材料抗拉强度≥470MPa，屈服强度≥400MPa，延伸率≥8%；\n2. 厚度方向压缩强度≥600MPa，疲劳寿命较现用7075-T6结构件提升≥20%；\n3. 动态冲击性能满足10³-10⁴/S应变率下结构可靠性验证要求；\n4. 中性盐雾试验≥1000小时，表面无明显点蚀，腐蚀速率≤0.01mm/年；\n5. 焊接热影响区强度保持率≥85%，焊后结构件尺寸变形量≤0.3%；\n6. 材料密度≤2.78g/cm³，典型结构件减重≥8%；\n7. 完成3批次中试样件，批次抗拉强度波动≤±15MPa；\n8. 形成材料成分设计、熔炼铸造、热处理、焊接及结构件应用工艺规范各1套；\n9. 申请发明专利2项以上，形成企业标准1项。",
    problem:
      "公司面向高端无人机、无人艇和近海巡检平台开发新一代轻量化承力结构件。现有7075-T6和6061-T6材料在近海高盐雾、高湿热、强振动、动态冲击工况下暴露出耐腐蚀不足、焊接后强度衰减、厚度方向性能不稳定、批次一致性不足等问题。\n本项目拟重点突破四类难题：\n1. 高强度、高韧性和耐腐蚀性能之间的协同平衡；\n2. Fe、Si杂质相控制与Mn、Zr、Ti等微合金化元素协同强化；\n3. 大尺寸结构件焊接热影响区强度保持和变形控制；\n4. 中试批量生产过程中成分均匀性、热处理稳定性和批次性能波动控制。",
    foundation:
      "公司现有员工260人，其中研发、工艺和检测人员48人，已成立无人装备轻量化结构研发小组。公司具备无人机机体结构件、无人艇承力框架、复合材料连接件等产品研发和小批量生产经验。\n现有条件包括：\n1. 生产与试验场地：航空港区结构件加工与总装基地约12000平方米，其中中试车间3000平方米；\n2. 加工设备：五轴加工中心6台、自动焊接机器人4套、热处理炉3台、真空钎焊设备1套；\n3. 检测设备：万能材料试验机、冲击试验机、盐雾试验箱、三坐标测量仪、金相显微镜、硬度计、超声探伤设备；\n4. 研发基础：已完成2型无人艇承力框架和3型无人机机臂结构件试制，掌握现用7075、6061材料失效样件数据；\n5. 合作基础：已与省内高校材料学院建立初步合作意向，可提供样件、工况数据和中试验证场景。",
    budget: 5000000,
    amount: 5000000,
    mode: "联合开发",
    nature: "民营企业",
    type: "技术攻关",
    deadline: "2026/12/31",
    source: "企业自主发布",
    keywords: "Al-Zn-Mg，海洋环境，无人艇，无人机，中试验证，动态冲击，技术攻关",
    demoPoint: "最适合压轴，展示高分、专家推荐、多智能体协作、技术经理人磋商和报告生成。",
  },
];

const headers = [
  "演示版本",
  "预计档次",
  "预计分数",
  "需求名称",
  "所属单位或公司名称",
  "技术领域",
  "所属地区",
  "技术指标",
  "拟解决的技术难题",
  "现有基础条件",
  "预算资金",
  "预算金额",
  "合作方式",
  "单位性质",
  "需求类型",
  "有效期",
  "信息来源",
  "需求关键词",
  "现场演示重点",
];

const data = rows.map((r) => [
  r.version,
  r.band,
  r.score,
  r.title,
  r.company,
  r.field,
  r.region,
  r.indicators,
  r.problem,
  r.foundation,
  r.budget,
  r.amount,
  r.mode,
  r.nature,
  r.type,
  r.deadline,
  r.source,
  r.keywords,
  r.demoPoint,
]);

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("演示需求样例");
sheet.showGridLines = false;

sheet.getRange("A1:S1").merge();
sheet.getRange("A1").values = [["企业技术需求真实性评分演示样例"]];
sheet.getRange("A2:S2").merge();
sheet.getRange("A2").values = [["同一技术主题的不同填报版本，用于现场演示需求真实性评分、专家匹配和技术经理人介入效果。"]];

sheet.getRange("A4:S4").values = [headers];
sheet.getRangeByIndexes(4, 0, data.length, headers.length).values = data;

sheet.freezePanes.freezeRows(4);

sheet.getRange("A1:S2").format.font = { name: "Arial", color: "#0B2F5B" };
sheet.getRange("A1").format.font = { name: "Arial", size: 18, bold: true, color: "#0B2F5B" };
sheet.getRange("A2").format.font = { name: "Arial", size: 10, color: "#4B6380" };
sheet.getRange("A1:S2").format.fill = { color: "#EAF5FF" };

const header = sheet.getRange("A4:S4");
header.format.fill = { color: "#173B6D" };
header.format.font = { bold: true, color: "#FFFFFF" };
header.format.wrapText = true;
header.format.horizontalAlignment = "center";
header.format.verticalAlignment = "center";

const body = sheet.getRange("A5:S9");
body.format.font = { name: "Arial", size: 10, color: "#10243E" };
body.format.wrapText = true;
body.format.verticalAlignment = "top";
body.format.borders = { preset: "inside", style: "thin", color: "#D9E6F2" };
sheet.getRange("A4:S9").format.borders = { preset: "outside", style: "medium", color: "#9DB8D6" };

sheet.getRange("K5:L9").format.numberFormat = [["#,##0"], ["#,##0"], ["#,##0"], ["#,##0"], ["#,##0"]];
sheet.getRange("A5:C9").format.horizontalAlignment = "center";
sheet.getRange("K5:Q9").format.horizontalAlignment = "center";

sheet.getRange("A5:S5").format.fill = { color: "#FFF4F2" };
sheet.getRange("A6:S6").format.fill = { color: "#FFFBEA" };
sheet.getRange("A7:S7").format.fill = { color: "#F4FAFF" };
sheet.getRange("A8:S8").format.fill = { color: "#EEF7FF" };
sheet.getRange("A9:S9").format.fill = { color: "#E9F6FF" };

const widths = [
  9, 10, 10, 34, 20, 12, 12, 48, 56, 56, 12, 12, 12, 12, 12, 12, 14, 32, 42,
];
for (let i = 0; i < widths.length; i++) {
  sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = widths[i];
}
sheet.getRange("A1:S1").format.rowHeight = 32;
sheet.getRange("A2:S2").format.rowHeight = 24;
sheet.getRange("A4:S4").format.rowHeight = 34;
for (let r = 5; r <= 9; r++) {
  sheet.getRange(`A${r}:S${r}`).format.rowHeight = r >= 8 ? 185 : 130;
}

const guide = workbook.worksheets.add("现场演示顺序");
guide.showGridLines = false;
guide.getRange("A1:E1").merge();
guide.getRange("A1").values = [["建议现场演示顺序"]];
guide.getRange("A3:E6").values = [
  ["步骤", "复制版本", "演示目的", "建议讲法", "预期系统效果"],
  ["1", "版本1", "识别敷衍填报", "同样是材料升级，但这个需求没有指标、没有场景、没有基础。", "低分或高风险，暂缓专家推荐。"],
  ["2", "版本3", "展示可补充需求", "企业说清了场景、指标和基础，但还需要进一步补充验收与样件数据。", "中高分，可匹配专家，同时提示补充材料。"],
  ["3", "版本5", "展示高质量闭环", "高质量需求会直接进入专家推荐、多智能体协作和技术经理人磋商。", "高分，推荐专家、成果和技术经理人，生成撮合报告。"],
];
guide.getRange("A1").format.font = { name: "Arial", size: 18, bold: true, color: "#0B2F5B" };
guide.getRange("A1:E1").format.fill = { color: "#EAF5FF" };
guide.getRange("A3:E3").format.fill = { color: "#173B6D" };
guide.getRange("A3:E3").format.font = { bold: true, color: "#FFFFFF" };
guide.getRange("A3:E6").format.wrapText = true;
guide.getRange("A3:E6").format.borders = { preset: "all", style: "thin", color: "#D9E6F2" };
guide.getRange("A3:E6").format.verticalAlignment = "top";
guide.getRange("A:A").format.columnWidth = 8;
guide.getRange("B:B").format.columnWidth = 14;
guide.getRange("C:C").format.columnWidth = 22;
guide.getRange("D:D").format.columnWidth = 48;
guide.getRange("E:E").format.columnWidth = 36;
guide.freezePanes.freezeRows(3);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(outputPath);
