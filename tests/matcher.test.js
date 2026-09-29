const assert = require("assert");
const { cosineSimilarity, scoreExperts } = require("../src/matcher");

assert(cosineSimilarity(["智能制造", "装备"], ["智能制造", "装备"]) > 0.99);
assert.strictEqual(cosineSimilarity(["a"], ["b"]), 0);

const demand = {
  name: "装备预测性维护",
  field: "智能制造",
  technicalIndicators: "预测准确率85%",
  problem: "工业互联网数据建模",
  foundation: "MES系统",
  keywords: "装备制造,预测性维护"
};

const experts = [
  { id: 1, field: "智能制造", keywords: "装备制造,预测性维护,工业互联网", bio: "设备故障预测", activeScore: 90, region: "国内" },
  { id: 2, field: "生物医药", keywords: "药物筛选", bio: "AI制药", activeScore: 90, region: "上海" }
];

const ranked = scoreExperts(demand, experts);
assert.strictEqual(ranked[0].id, 1);
assert(ranked[0].matchScore > ranked[1].matchScore);
assert(ranked[0].matchScore >= 70);

const filmDemand = {
  name: "农业大棚塑料耐老化升级",
  field: "现代农业",
  technicalIndicators: "抗拉强度提升20%，耐老化周期不低于36个月，透光率保持率不低于85%",
  problem: "现有农业大棚塑料薄膜易撕裂、老化快，影响设施农业连续生产。",
  foundation: "已有温室大棚应用场景和试点基地。",
  keywords: "农业大棚,塑料,耐老化,高强"
};

const filmExperts = [
  { id: 3, field: "新材料", keywords: "高强棚膜,功能薄膜,农膜,抗撕裂,耐候材料", bio: "长期研究设施农业功能薄膜和高强耐老化棚膜", activeScore: 88, region: "国内" },
  { id: 4, field: "生物医药", keywords: "医用敷料,细胞材料", bio: "医疗器械转化", activeScore: 90, region: "上海" }
];

const filmRanked = scoreExperts(filmDemand, filmExperts);
assert.strictEqual(filmRanked[0].id, 3);
assert(filmRanked[0].matchScore >= 70);
assert(["匹配较高", "匹配很高", "匹配超级高"].includes(filmRanked[0].matchLevel));

console.log("matcher tests passed");
