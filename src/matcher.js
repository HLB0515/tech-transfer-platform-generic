function tokenize(text) {
  const lexicon = [
    "人工智能", "智能制造", "新材料", "生物医药", "现代农业", "节能环保", "电子信息", "高端装备",
    "冷链", "铁路", "检测", "数据治理", "标准化", "软件工厂", "中试", "量产", "产业化",
    "铝合金", "铝箔", "动力电池", "轧制", "金属成形", "材料成形", "材料塑性成形", "先进合金", "无人装备", "大棚", "塑料", "棚膜", "农业", "细胞", "康复", "医用", "传感器",
    "机器人", "视觉", "储能", "复合材料", "知识产权", "专利", "高企", "专精特新",
    "耐腐蚀", "高强", "轻量化", "热管理", "病虫害", "遥感", "发酵", "菌种", "压力容器",
    "漏电保护", "车轮", "非接触", "几何参数", "工业软件", "多模态", "膜分离", "近红外"
  ];
  const chunks = String(text || "")
    .toLowerCase()
    .replace(/[，。；、]/g, ",")
    .split(/[\s,;|/]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  const tokens = [];
  chunks.forEach((chunk) => {
    tokens.push(chunk);
    lexicon.forEach((term) => {
      if (chunk.includes(term.toLowerCase())) tokens.push(term.toLowerCase());
    });
    const chinese = chunk.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    chinese.forEach((word) => {
      for (let i = 0; i < word.length - 1; i += 1) tokens.push(word.slice(i, i + 2));
      for (let i = 0; i < word.length - 2; i += 1) tokens.push(word.slice(i, i + 3));
    });
  });
  return tokens;
}

const semanticConcepts = {
  agriculturalFilm: ["大棚", "棚膜", "农膜", "塑料", "薄膜", "高强", "耐老化", "设施农业", "农业大棚", "温室", "抗撕裂"],
  aluminumAlloy: ["铝合金", "al-zn-mg", "高强", "耐腐蚀", "轻量化", "无人机", "无人艇", "无人装备", "盐雾", "焊接", "动态冲击"],
  batteryFoil: ["动力电池", "铝箔", "超薄", "高延展", "高强", "轧制", "金属成形", "材料塑性成形", "材料成形", "表面缺陷", "先进合金", "金属材料", "焊接连接"],
  batteryThermal: ["电池", "热管理", "低温", "续航", "热失控", "新能源", "商用车", "储能", "安全监测"],
  smartAgriculture: ["遥感", "病虫害", "小麦", "玉米", "智慧农业", "图像识别", "无人机", "农情", "预警"],
  medicalMaterial: ["医用", "敷料", "止血", "可降解", "生物相容", "注册", "临床", "灭菌", "医疗器械"],
  semiconductorCoating: ["半导体", "湿法", "清洗", "刻蚀", "耐腐蚀", "涂层", "关键部件", "洁净"],
  industrialVision: ["机器人", "视觉", "打磨", "复杂曲面", "反光", "柔性产线", "识别精度", "节拍"],
  mineSafety: ["矿山", "井下", "风险预警", "气体", "视频", "微震", "人员定位", "应急通信", "无人巡检"],
  coldChainTrace: ["冷链", "温控", "品质", "追溯", "标签", "食品", "柔性传感", "商超", "温湿度"],
  industrialSoftware: ["软件工厂", "数据治理", "标准化", "多模态", "工业互联网", "时序数据", "模型库", "低代码"],
  railwayInspection: ["铁路", "车轮", "几何参数", "非接触", "线激光", "轮缘", "踏面", "检测仪", "动车"],
  fermentationFood: ["发酵", "菌种", "功能食品", "饮品", "微生物", "货架期", "工艺放大", "500l"]
};

const fieldCompatibility = {
  现代农业: ["现代农业", "人工智能", "新材料", "现代食品"],
  人工智能: ["人工智能", "智能制造", "现代农业", "电子信息", "安全应急"],
  新材料: ["新材料", "先进制造业", "智能制造", "新能源", "生物医药", "现代农业", "材料科学与工程", "机械工程"],
  生物医药: ["生物医药", "新材料", "现代食品"],
  智能制造: ["智能制造", "高端装备", "电子信息", "人工智能", "新材料", "安全应急"],
  新能源: ["新能源", "新材料", "先进制造业", "智能制造", "电子信息"],
  节能环保: ["节能环保", "智能制造", "新材料"],
  现代食品: ["现代食品", "现代农业", "生物医药", "人工智能"],
  安全应急: ["安全应急", "智能制造", "人工智能", "电子信息"],
  电子信息: ["电子信息", "人工智能", "智能制造", "集成电路"],
  集成电路: ["集成电路", "电子信息", "新材料", "智能制造"]
};

function normalizedText(record) {
  return [
    record.name,
    record.field,
    record.keywords,
    record.technicalIndicators,
    record.problem,
    record.foundation,
    record.detail,
    record.bio,
    record.intro,
    record.researchDirection,
    record.specialties,
    record.achievements,
    record.relatedResults,
    record.organization
  ].join(" ").toLowerCase();
}

function conceptScores(text) {
  return Object.entries(semanticConcepts).reduce((map, [concept, words]) => {
    map[concept] = words.reduce((sum, word) => sum + (text.includes(word.toLowerCase()) ? 1 : 0), 0) / words.length;
    return map;
  }, {});
}

function semanticSimilarity(aText, bText) {
  const a = conceptScores(aText);
  const b = conceptScores(bText);
  let best = 0;
  Object.keys(semanticConcepts).forEach((concept) => {
    best = Math.max(best, Math.min(a[concept], b[concept]));
  });
  return best;
}

function compatibleFieldScore(demandField, expertField, demandText, expertText) {
  if (!demandField || !expertField) return 0;
  if (demandField === expertField) return 1;
  const compatible = fieldCompatibility[demandField] || [];
  if (compatible.includes(expertField)) return 0.72;
  if (/新材料|新能源/.test(demandField) && /先进制造|材料科学|机械工程|金属|材料/.test(`${expertField} ${expertText}`)) return 0.8;
  if (/智能制造|高端装备/.test(demandField) && /先进制造|机械工程|自动化|装备/.test(`${expertField} ${expertText}`)) return 0.78;
  if (demandText.includes(String(expertField).toLowerCase()) || expertText.includes(String(demandField).toLowerCase())) return 0.58;
  return 0;
}

function scoreBand(score) {
  if (score < 60) return { level: "不合格", label: "不推荐", className: "low", action: "不建议直接对接，先补充需求或更换专家" };
  if (score < 70) return { level: "凑合适中", label: "谨慎备选", className: "medium", action: "可作为备选，建议补充访谈后再决定" };
  if (score < 80) return { level: "匹配较高", label: "建议对接", className: "good", action: "可进入一轮预沟通" };
  if (score < 90) return { level: "匹配很高", label: "优先对接", className: "great", action: "建议优先授权并进入磋商" };
  return { level: "匹配超级高", label: "重点撮合", className: "super", action: "建议列为重点撮合项目并形成报告" };
}

function termFrequency(tokens) {
  return tokens.reduce((map, token) => {
    map[token] = (map[token] || 0) + 1;
    return map;
  }, {});
}

function cosineSimilarity(aTokens, bTokens) {
  const a = termFrequency(aTokens);
  const b = termFrequency(bTokens);
  const terms = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  terms.forEach((term) => {
    const av = a[term] || 0;
    const bv = b[term] || 0;
    dot += av * bv;
    aMag += av * av;
    bMag += bv * bv;
  });
  return aMag && bMag ? dot / (Math.sqrt(aMag) * Math.sqrt(bMag)) : 0;
}

function textIncludesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function analyzeDemandComplexity(demand) {
  const text = [
    demand.name,
    demand.field,
    demand.technicalIndicators,
    demand.problem,
    demand.foundation,
    demand.keywords,
    demand.detail
  ].join(" ");
  let score = 0;
  const reasons = [];

  const indicatorCount = countMatches(text, /\d+(?:\.\d+)?|≥|≤|不低于|不高于|MPa|GPa|nm|微米|小时|吨|%|℃/g);
  if (indicatorCount >= 6) {
    score += 22;
    reasons.push("技术指标多，需要专家逐项确认");
  } else if (indicatorCount >= 3) {
    score += 12;
    reasons.push("包含明确量化指标");
  }

  if (textIncludesAny(text, ["中试", "量产", "产业化", "批量", "稳定性", "一致性", "可靠性", "良率"])) {
    score += 20;
    reasons.push("涉及中试/量产/可靠性验证");
  }

  if (textIncludesAny(text, ["专利", "知识产权", "侵权", "许可", "FTO", "军工", "适航", "认证", "临床", "注册"])) {
    score += 18;
    reasons.push("涉及知识产权或合规风险");
  }

  if (textIncludesAny(text, ["联合开发", "长期供应", "作价入股", "投融资", "基金", "供应链", "质量责任", "赔偿"])) {
    score += 16;
    reasons.push("合作模式和商务责任需要磋商");
  }

  if (String(demand.problem || "").length > 80 || String(demand.technicalIndicators || "").length > 90) {
    score += 14;
    reasons.push("需求描述较复杂，需拆解标准需求单");
  }

  if (!demand.budgetAmount && !demand.budget && !demand.budgetText) {
    score += 10;
    reasons.push("预算不清，需要技术经理人澄清边界");
  }

  const level = score >= 55 ? "complex" : score >= 32 ? "medium" : "simple";
  const route = level === "complex" ? "manager-led" : "direct-match";
  return {
    complexityScore: Math.min(100, score),
    complexityLevel: level,
    route,
    routeLabel: route === "manager-led" ? "建议技术经理人介入磋商" : "可直接推荐专家/成果",
    reasons: reasons.length ? reasons : ["需求边界较清晰，可直接进行专家/成果推荐"]
  };
}

function scoreExperts(demand, experts) {
  const demandText = normalizedText(demand);
  const demandTokens = tokenize(demandText);
  const complexity = analyzeDemandComplexity(demand);
  const authenticityScore = Number(demand.authenticity?.score || 75);

  return experts
    .map((expert) => {
      const expertText = normalizedText(expert);
      const expertTokens = tokenize(expertText);
      const keywordScore = cosineSimilarity(demandTokens, expertTokens);
      const fieldScore = compatibleFieldScore(demand.field, expert.field, demandText, expertText);
      const semanticScore = semanticSimilarity(demandText, expertText);
      const indicatorText = `${demand.technicalIndicators || ""} ${demand.problem || ""}`.toLowerCase();
      const capabilityText = `${expert.keywords || ""} ${expert.bio || ""} ${expert.intro || ""} ${expert.achievements || ""} ${expert.researchDirection || ""} ${expert.category || ""} ${expert.relatedResults || ""}`.toLowerCase();
      const technicalScore = tokenize(indicatorText).length && tokenize(capabilityText).length
        ? cosineSimilarity(tokenize(indicatorText), tokenize(capabilityText))
        : 0;
      const domainTerms = [
        "铝合金", "铝箔", "合金", "金属", "金属成形", "材料", "材料成形", "材料塑性成形", "轧制", "表面缺陷", "焊接", "成形", "碳纤维", "复合材料", "高分子", "耐腐蚀",
        "机器人", "控制", "传感", "检测", "低温", "透平", "电缆", "电池", "净水", "环保", "遥感",
        "农业", "生物", "医药", "芯片", "半导体", "软件", "人工智能", "算法", "装备", "工艺"
      ];
      const directHits = domainTerms.filter((term) => demandText.includes(term.toLowerCase()) && expertText.includes(term.toLowerCase()));
      const specialtyHit = String(expert.keywords || expert.researchDirection || "")
        .split(/[，,、;；\s/]+/)
        .filter((term) => term && term.length >= 2)
        .some((term) => demandText.includes(term.toLowerCase()));
      const regionHit = /长三角|上海|江苏|浙江|安徽/.test(`${demand.region} ${expert.region}`);
      const regionalScore = regionHit ? 1 : 0;
      const activityScore = Math.min(Number(expert.activeScore || 70) / 100, 1);
      const maturityScore = /中试|产业化|示范|应用|样件|工艺|检测|量产/.test(`${expert.bio} ${expert.keywords} ${expert.organization}`) ? 1 : 0.55;
      const authenticityPenalty = authenticityScore < 60 ? -0.18 : authenticityScore < 70 ? -0.06 : 0;
      const raw =
        keywordScore * 0.24 +
        semanticScore * 0.22 +
        fieldScore * 0.18 +
        technicalScore * 0.16 +
        maturityScore * 0.08 +
        regionalScore * 0.06 +
        activityScore * 0.06 +
        authenticityPenalty;
      const calibration =
        (fieldScore === 1 ? 16 : fieldScore >= 0.78 ? 12 : fieldScore >= 0.7 ? 10 : 0) +
        (directHits.length >= 3 ? 14 : directHits.length === 2 ? 10 : directHits.length === 1 ? 6 : 0) +
        (specialtyHit ? 20 : 0) +
        (keywordScore >= 0.2 ? 6 : keywordScore >= 0.12 ? 3 : 0) +
        (semanticScore >= 0.18 ? 6 : semanticScore >= 0.1 ? 3 : 0) +
        (technicalScore >= 0.15 ? 6 : technicalScore >= 0.08 ? 3 : 0);
      const matchScore = Math.max(0, Math.min(99, Math.round(raw * 100 + calibration)));
      const band = scoreBand(matchScore);
      const managerRecommended = matchScore >= 70 && (complexity.route === "manager-led" || complexity.complexityScore >= 32 || technicalScore >= 0.18 && semanticScore >= 0.18);
      const reason = [
        band.level,
        fieldScore >= 0.7 ? "技术领域高度相关" : fieldScore > 0 ? "相邻产业方向可承接" : "领域相关度较弱",
        semanticScore >= 0.18 ? "AI语义词典识别到专业概念相关" : keywordScore > 0.18 ? "需求关键词与专家能力画像相似" : "关键词重合有限",
        technicalScore >= 0.18 ? "技术指标与专家能力存在对应关系" : "技术指标仍需专家侧确认",
        regionHit ? "具备长三角协作场景" : "可远程对接",
        managerRecommended ? "复杂且匹配度较高，建议技术经理人介入撮合" : "可先由双方智能体预沟通"
      ].join("；");
      return {
        ...expert,
        matchScore,
        matchLevel: band.level,
        matchLabel: band.label,
        matchClass: band.className,
        matchAction: band.action,
        managerRecommended,
        reason,
        algorithm: {
          keyword: Math.round(keywordScore * 100),
          semantic: Math.round(semanticScore * 100),
          field: Math.round(fieldScore * 100),
          technical: Math.round(technicalScore * 100),
          region: Math.round(regionalScore * 100),
          activity: Math.round(activityScore * 100),
          maturity: Math.round(maturityScore * 100),
          authenticity: authenticityScore,
          complexity
        },
        recommendationRoute: managerRecommended ? "manager-led" : complexity.route,
        recommendationRouteLabel: managerRecommended ? "建议技术经理人介入磋商" : complexity.routeLabel
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { tokenize, cosineSimilarity, analyzeDemandComplexity, scoreExperts };
