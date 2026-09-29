const { useEffect, useMemo, useState } = React;

const api = {
  get: (url) => fetch(url).then((res) => res.json()),
  post: (url, data) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "请求失败");
      return json;
    })
};

const navItems = [
  ["workspace", "我的工作台"],
  ["portal", "首页"],
  ["achievements", "成果库"],
  ["demands", "需求库"],
  ["experts", "专家库"],
  ["managers", "技术经理人"],
  ["matches", "供需匹配"],
  ["negotiation", "磋商室"],
  ["demo", "演示视频"],
  ["agents", "智能体广场"],
  ["publish", "发布需求"],
  ["dashboard", "数据看板"]
];

const adminNavItem = ["admin", "管理后台"];
const topNavItems = [
  ["portal", "首页"],
  ["achievements", "成果库"],
  ["demands", "需求库"],
  ["experts", "专家库"],
  ["matches", "智能匹配"],
  ["agents", "智能体"]
];

const demoTotals = Object.freeze({
  demands: 3876,
  experts: 3129,
  techManagers: 2133,
  matches: 1672
});

const demoAccounts = [
  { role: "管理员", phone: "13800000000", password: "admin123", desc: "查看全平台统计、三库管理和数据总览" },
  { role: "企业", phone: "13800000001", password: "qiye123", desc: "发布企业介绍、需求登记，使用科小企" },
  { role: "专家", phone: "13800000002", password: "zhuanjia123", desc: "发布专家信息、成果信息，使用科小专" },
  { role: "技术经理人", phone: "13800000003", password: "jingli123", desc: "接收撮合任务和推进计划，使用科小经" }
];

const emptyDemand = {
  name: "",
  company: "豫创装备有限公司",
  field: "智能制造",
  technicalIndicators: "",
  problem: "",
  foundation: "",
  cooperation: "联合开发",
  orgType: "民营企业",
  budgetAmount: 1000000,
  demandType: "技术攻关",
  region: "国内",
  validUntil: "2026-12-31",
  source: "企业自主发布",
  keywords: ""
};

const emptyAchievement = {
  name: "",
  completer: "",
  organization: "",
  summary: "",
  field: "先进制造",
  form: "",
  stage: "",
  level: "",
  keywords: "",
  contact: "",
  transferMode: "",
  transferNote: ""
};

const emptyExpert = {
  intro: "",
  name: "",
  keywords: "",
  field: "先进制造业",
  achievements: "",
  region: "北京",
  researchDirection: "",
  organization: "",
  orgType: "高等院校",
  position: "",
  department: "",
  category: "",
  title: "",
  gender: "",
  education: "",
  graduatedFrom: "",
  contact: "",
  bio: "",
  activeScore: 86
};

const achievementFields = [
  ["name", "成果名称", "input", true],
  ["completer", "完成人", "input"],
  ["organization", "完成单位", "input"],
  ["summary", "成果简介", "textarea", true],
  ["field", "所属高新技术领域", "input"],
  ["form", "成果体现形式", "input"],
  ["stage", "成果所处阶段", "input"],
  ["level", "成果技术水平", "input"],
  ["keywords", "成果关键字", "input"],
  ["contact", "联系人", "input"],
  ["transferMode", "拟采取的转化方式", "input"],
  ["transferNote", "转化说明", "textarea"]
];

const demandAdminFields = [
  ["name", "需求名称", "input", true],
  ["company", "所属单位或公司名称", "input"],
  ["field", "技术领域", "input"],
  ["detail", "需求详情", "textarea"],
  ["technicalIndicators", "技术指标", "textarea"],
  ["problem", "拟解决的技术难题", "textarea"],
  ["foundation", "现有基础条件", "textarea"],
  ["cooperation", "合作方式", "input"],
  ["orgType", "单位性质", "input"],
  ["budgetText", "预算金额", "input"],
  ["demandType", "需求类型", "input"],
  ["region", "所属地区", "input"],
  ["validUntilText", "有效期", "input"],
  ["updatedAt", "更新时间", "input"]
];

const realDemandFields = [
  ["name", "需求名称", "input", true],
  ["company", "真实需求企业", "input", true],
  ["field", "技术领域", "input"],
  ["detail", "需求详情/应用场景", "textarea", true],
  ["technicalIndicators", "可验收技术指标", "textarea", true],
  ["problem", "拟解决的真实技术难题", "textarea"],
  ["foundation", "现有基础/产线/样品/数据", "textarea"],
  ["cooperation", "合作方式", "input"],
  ["orgType", "单位性质", "input"],
  ["budgetText", "预算金额", "input"],
  ["demandType", "需求类型", "input"],
  ["region", "所属地区", "input"],
  ["validUntilText", "有效期", "input"],
  ["contact", "企业联系人/复核人", "input"],
  ["evidence", "补证材料记录", "textarea"],
  ["source", "信息来源", "input"]
];

const expertFields = [
  ["intro", "专家介绍", "textarea"],
  ["name", "专家名称", "input", true],
  ["keywords", "专业特长", "input"],
  ["field", "战略性新兴产业分类", "input"],
  ["achievements", "工作业绩及专业资质", "textarea"],
  ["region", "所属地域", "input"],
  ["researchDirection", "研究方向", "input"],
  ["organization", "所属单位", "input"],
  ["orgType", "单位性质", "input"],
  ["position", "职务", "input"],
  ["department", "现所在部门", "input"],
  ["category", "专业类别", "input"],
  ["title", "专业技术职称", "input"],
  ["gender", "性别", "input"],
  ["education", "最高学历", "input"],
  ["graduatedFrom", "毕业院校", "input"],
  ["contact", "联系方式", "input"],
  ["bio", "个人简介", "textarea"]
];

const techManagerFields = [
  ["name", "经理人名称", "input", true],
  ["title", "头衔", "input"],
  ["organization", "服务机构", "input"],
  ["region", "所属地域", "input"],
  ["industries", "服务产业", "input"],
  ["serviceTags", "服务标签", "input"],
  ["currentLoad", "当前任务数", "input"],
  ["responseRate", "响应率", "input"],
  ["dealCount", "成交项目数", "input"],
  ["focus", "擅长方向", "textarea"]
];

const matchAdminFields = [
  ["demandName", "需求名称", "input", true],
  ["expertName", "专家/成果方", "input"],
  ["field", "技术领域", "input"],
  ["score", "匹配指数", "input"],
  ["successScore", "成功指数", "input"],
  ["reason", "匹配理由", "textarea"],
  ["suggestion", "转化建议", "textarea"]
];

const agentAdminFields = [
  ["name", "智能体名称", "input", true],
  ["nickname", "智能体昵称", "input"],
  ["role", "角色标识", "input"],
  ["category", "智能体类别", "input"],
  ["avatar", "头像字", "input"],
  ["desc", "能力说明", "textarea"],
  ["prompt", "默认提示词", "textarea"],
  ["benchmark", "对标对象", "textarea"],
  ["dataSet", "训练/知识数据集", "textarea"],
  ["expectedEffect", "预期效果", "textarea"],
  ["demoQuestions", "领导演示问题与预设答案", "textarea"]
];

const videoAdminFields = [
  ["title", "视频标题", "input", true],
  ["category", "视频类别", "input"],
  ["cover", "封面说明", "input"],
  ["url", "视频链接", "input"],
  ["desc", "视频说明", "textarea"]
];

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", role: "enterprise", phone: "13800000001", password: "demo123" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const result = await api.post(mode === "login" ? "/api/login" : "/api/register", form);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return React.createElement("div", { className: "auth" },
    React.createElement("section", { className: "auth-panel" },
      React.createElement("span", { className: "eyebrow" }, "长三角协同创新"),
      React.createElement("h1", null, "科技成果转化平台"),
      React.createElement("p", null, "企业需求、专家能力、成果资源在一个工作台内完成发布、匹配、对话和跟踪。"),
      React.createElement("form", { onSubmit: submit },
        mode === "register" && React.createElement("input", { placeholder: "姓名或单位名称", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }),
        mode === "register" && React.createElement("select", { value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }) },
          React.createElement("option", { value: "enterprise" }, "企业用户"),
          React.createElement("option", { value: "expert" }, "专家用户")
        ),
        React.createElement("input", { placeholder: "手机号", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) }),
        React.createElement("input", { placeholder: "密码", type: "password", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }) }),
        error && React.createElement("span", { className: "tag accent" }, error),
        React.createElement("button", { className: "primary" }, mode === "login" ? "登录进入平台" : "注册并进入"),
        React.createElement("button", { type: "button", className: "ghost", onClick: () => setMode(mode === "login" ? "register" : "login") }, mode === "login" ? "创建新用户" : "已有账号登录")
      ),
      React.createElement("div", { className: "demo-account-grid" },
        demoAccounts.map((account) => React.createElement("button", {
          type: "button",
          className: "demo-account",
          key: account.phone,
          onClick: () => setForm({ ...form, phone: account.phone, password: account.password })
        },
          React.createElement("b", null, account.role),
          React.createElement("span", null, `${account.phone} / ${account.password}`),
          React.createElement("small", null, account.desc)
        ))
      )
    )
  );
}

function App() {
  const initialGlobalSearchQuery = new URLSearchParams(window.location.search).get("search") || "";
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("transferUser") || "null"));
  const [page, setPage] = useState("portal");
  const [demands, setDemands] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchMeta, setMatchMeta] = useState({ complexity: null, managers: [] });
  const [conversation, setConversation] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState(initialGlobalSearchQuery);
  const [globalSearchResult, setGlobalSearchResult] = useState(null);
  const [globalSearchLoading, setGlobalSearchLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState({ type: "", query: "" });

  useEffect(() => {
    if (user) localStorage.setItem("transferUser", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (user) refreshDemands();
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const query = globalSearchQuery.trim();
    if (!query) return undefined;
    const timer = window.setTimeout(() => loadGlobalSearch(query), 320);
    return () => window.clearTimeout(timer);
  }, [globalSearchQuery, user]);

  async function refreshDemands() {
    const result = await api.get("/api/demands");
    setDemands(result.demands);
    if (!selectedDemand && result.demands[0]) {
      setSelectedDemand(result.demands[0]);
      loadMatches(result.demands[0].id);
    }
  }

  async function loadMatches(demandId) {
    const result = await api.get(`/api/matches/${demandId}`);
    setSelectedDemand(result.demand);
    setMatches(result.matches);
    setMatchMeta({ complexity: result.complexity || null, managers: result.managers || [] });
  }

  async function startConversation(expert) {
    const result = await api.post("/api/conversations", { demandId: selectedDemand.id, expertId: expert.id, reset: true });
    setConversation(result.conversation);
    setPage("negotiation");
  }

  async function loadGlobalSearch(searchQuery) {
    const query = String(searchQuery || "").trim();
    if (!query) return;
    setGlobalSearchQuery(query);
    setGlobalSearchLoading(true);
    setPage("search");
    try {
      const result = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
      setGlobalSearchResult(result);
    } finally {
      setGlobalSearchLoading(false);
    }
  }

  function clearGlobalSearch() {
    setGlobalSearchQuery("");
    setGlobalSearchResult(null);
    if (page === "search") setPage("portal");
  }

  function openGlobalSearchGroup(type, query) {
    setLibrarySearch({ type, query });
    setPage(type);
  }

  if (!user) return React.createElement(Auth, { onLogin: setUser });
  const visibleNavItems = getNavItems(user.role);
  const roleLabel = getRoleLabel(user.role);

  return React.createElement("div", { className: "app-shell portal-shell" },
    React.createElement("aside", { className: "sidebar site-header" },
      React.createElement("div", { className: "brand" },
        React.createElement("strong", null, "科技成果转化平台"),
        React.createElement("span", null, "NSTL · 专家库 · 需求库 · 智能体撮合")
      ),
      React.createElement("nav", { className: "nav" }, visibleNavItems.map(([id, label]) =>
        React.createElement("button", { key: id, className: page === id ? "active" : "", onClick: () => setPage(id) }, label)
      ))
    ),
    React.createElement("main", { className: "main" },
      React.createElement("header", { className: page === "portal" ? "topbar topbar-home" : "topbar" },
        React.createElement("div", { className: "topbar-brand" },
          React.createElement("span", { className: "topbar-logo" }, "科"),
          React.createElement("strong", null, "科技成果转化平台"),
          React.createElement("em", null, "NSTL")
        ),
        React.createElement("nav", { className: "topbar-nav" }, topNavItems.map(([id, label]) =>
          React.createElement("button", { key: id, className: page === id ? "active" : "", onClick: () => setPage(id) }, label)
        )),
        React.createElement("div", { className: "topbar-search" },
          React.createElement("span", null, "⌕"),
          React.createElement("input", {
            value: globalSearchQuery,
            onChange: (event) => setGlobalSearchQuery(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter") loadGlobalSearch(event.currentTarget.value);
            },
            placeholder: "搜索成果、需求、专家..."
          }),
          globalSearchQuery && React.createElement("button", {
            type: "button",
            className: "topbar-search-clear",
            onClick: clearGlobalSearch,
            title: "清空搜索"
          }, "×"),
          React.createElement("button", {
            type: "button",
            className: "topbar-search-submit",
            disabled: globalSearchLoading,
            onClick: () => loadGlobalSearch(document.querySelector(".topbar-search input")?.value)
          }, globalSearchLoading ? "搜索中" : "搜索")
        ),
        page !== "portal" && React.createElement("h1", null, visibleNavItems.find(([id]) => id === page)?.[1]),
        React.createElement("div", { className: "user-pill" },
          React.createElement("span", null, roleLabel),
          React.createElement("span", { className: "avatar" }, user.name.slice(0, 1)),
          React.createElement("button", { className: "ghost", onClick: () => { localStorage.removeItem("transferUser"); setUser(null); } }, "退出")
        )
      ),
      React.createElement("section", { className: "content" },
        page === "workspace" && React.createElement(RoleWorkbench, { user, demands, selectedDemand, onCreatedDemand: (demand, newMatches) => { refreshDemands(); setSelectedDemand(demand); setMatches(newMatches || []); setMatchMeta({ complexity: null, managers: [] }); setPage("matches"); }, go: setPage }),
        page === "portal" && React.createElement(PortalHome, { user, go: setPage }),
        page === "dashboard" && React.createElement(Dashboard, null),
        page === "search" && React.createElement(GlobalSearchResults, {
          query: globalSearchQuery,
          result: globalSearchResult,
          loading: globalSearchLoading,
          onOpenGroup: openGlobalSearchGroup
        }),
        page === "publish" && (user.role === "enterprise"
          ? React.createElement(PublishDemand, { user, onCreated: (demand, newMatches, meta) => { refreshDemands(); setSelectedDemand(demand); setMatches(newMatches); setMatchMeta(meta || { complexity: null, managers: [] }); setPage("matches"); } })
          : React.createElement(RoleAccessNotice, { user, go: setPage })),
        page === "matches" && React.createElement(Matches, { demands, selectedDemand, matches, matchMeta, onSelect: loadMatches, onStart: startConversation }),
        page === "negotiation" && React.createElement(NegotiationRoom, { user, selectedDemand, conversation }),
        page === "experts" && React.createElement(ExpertsLibrary, { initialQuery: librarySearch.type === "experts" ? librarySearch.query : "" }),
        page === "managers" && React.createElement(TechManagers, { demands, selectedDemand, onSelectDemand: (demand) => { setSelectedDemand(demand); loadMatches(demand.id); } }),
        page === "demands" && React.createElement(DemandsLibrary, { initialQuery: librarySearch.type === "demands" ? librarySearch.query : "", onSelectDemand: (demand) => { setSelectedDemand(demand); loadMatches(demand.id); setPage("matches"); } }),
        page === "achievements" && React.createElement(Achievements, { initialQuery: librarySearch.type === "achievements" ? librarySearch.query : "" }),
        page === "agents" && React.createElement(Agents, { conversation, demands, selectedDemand, onConversation: setConversation }),
        page === "demo" && React.createElement(DemoVideo, null),
        page === "admin" && user.role === "admin" && React.createElement(AdminPanel, { refreshDemands })
      )
    )
  );
}

function GlobalSearchResults({ query, result, loading, onOpenGroup }) {
  if (loading) {
    return React.createElement("section", { className: "panel global-search-loading" },
      React.createElement("h2", null, `正在搜索“${query}”`),
      React.createElement("p", null, "正在同时检索成果库、需求库和专家库...")
    );
  }
  const groups = [
    ["achievements", "科技成果", result?.achievements || [], result?.counts?.achievements || 0],
    ["demands", "企业需求", result?.demands || [], result?.counts?.demands || 0],
    ["experts", "领域专家", result?.experts || [], result?.counts?.experts || 0]
  ];
  const total = groups.reduce((sum, group) => sum + group[3], 0);
  return React.createElement("section", { className: "global-search-page" },
    React.createElement("div", { className: "global-search-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "全站资源检索"),
        React.createElement("h2", null, result ? `“${query}”的搜索结果` : "输入关键词搜索平台资源"),
        React.createElement("p", null, result ? `共找到 ${total} 条相关资源，结果已按成果、需求和专家分类。` : "可搜索技术名称、企业、机构、专家、领域和关键词。")
      ),
      result && React.createElement("div", { className: "global-search-kpis" },
        libraryKpi("成果", result.counts.achievements),
        libraryKpi("需求", result.counts.demands),
        libraryKpi("专家", result.counts.experts)
      )
    ),
    result && total === 0 && React.createElement("div", { className: "panel search-empty-state" },
      React.createElement("h3", null, "没有找到相关资源"),
      React.createElement("p", null, "建议尝试更短的技术关键词、企业名称或专家研究方向。")
    ),
    result && groups.map(([type, label, items, count]) =>
      React.createElement("section", { className: "global-result-group", key: type },
        React.createElement("div", { className: "global-result-head" },
          React.createElement("div", null,
            React.createElement("h3", null, label),
            React.createElement("span", null, `找到 ${count} 条，当前展示前 ${items.length} 条`)
          ),
          count > 0 && React.createElement("button", { className: "secondary", onClick: () => onOpenGroup(type, query) }, `查看全部${label}`)
        ),
        items.length
          ? React.createElement("div", { className: "global-result-grid" }, items.map((item) =>
              React.createElement("article", { className: "global-result-card", key: `${type}-${item.id}` },
                React.createElement("span", { className: "global-result-type" }, label),
                React.createElement("h3", null, item.name),
                React.createElement("p", null, item.summary || item.detail || item.problem || item.intro || item.bio || "暂无简介"),
                React.createElement("div", { className: "meta" },
                  React.createElement("span", { className: "tag" }, item.organization || item.company || item.field || "平台资源"),
                  item.field && React.createElement("span", { className: "tag accent" }, item.field)
                ),
                React.createElement("button", { className: "ghost", onClick: () => onOpenGroup(type, item.name) }, "查看完整信息")
              )
            ))
          : React.createElement("div", { className: "global-result-empty" }, `未找到相关${label}`)
      )
    )
  );
}

function getRoleLabel(role) {
  return { admin: "管理员", enterprise: "企业用户", expert: "专家用户", manager: "技术经理人" }[role] || "平台用户";
}

function getNavItems(role) {
  if (role === "admin") return [["workspace", "总览后台"], ...navItems.filter(([id]) => !["workspace", "publish"].includes(id)), adminNavItem];
  if (role === "enterprise") return navItems.filter(([id]) => !["admin"].includes(id));
  if (role === "expert") return navItems.filter(([id]) => !["publish", "admin"].includes(id));
  if (role === "manager") return navItems.filter(([id]) => !["publish", "admin"].includes(id));
  return navItems;
}

function RoleAccessNotice({ user, go }) {
  const config = user.role === "expert"
    ? { title: "专家账号不能发布企业需求", text: "专家端用于维护专家画像、发布科技成果、回应企业磋商。请到专家后台登记成果或进入磋商室查看企业对接。", primary: "回到专家后台", page: "workspace", secondary: "发布成果", secondaryPage: "workspace" }
    : user.role === "manager"
      ? { title: "技术经理人不发布需求", text: "技术经理人负责接收平台派发的撮合任务、组织需求复核和供需磋商。", primary: "查看撮合任务", page: "workspace", secondary: "技术经理人中心", secondaryPage: "managers" }
      : { title: "管理员不以企业身份发布需求", text: "管理员负责三库维护、统计监管和磋商室监管。如需录入企业需求，请在管理后台的需求库中添加。", primary: "进入管理后台", page: "admin", secondary: "磋商监管", secondaryPage: "negotiation" };
  return React.createElement("section", { className: "panel role-access-notice" },
    React.createElement("span", { className: "eyebrow" }, getRoleLabel(user.role)),
    React.createElement("h2", null, config.title),
    React.createElement("p", null, config.text),
    React.createElement("div", { className: "hero-actions" },
      React.createElement("button", { className: "primary", onClick: () => go(config.page) }, config.primary),
      React.createElement("button", { className: "secondary", onClick: () => go(config.secondaryPage) }, config.secondary)
    )
  );
}

function RoleWorkbench({ user, demands, selectedDemand, onCreatedDemand, go }) {
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState("");
  const [enterpriseForm, setEnterpriseForm] = useState({ company: user.name, industry: "高端装备制造", region: "国内", scale: "200-500人", intro: "聚焦智能装备和新材料应用验证，具备中试产线与工程化团队。", contact: "企业联系人" });
  const [demandForm, setDemandForm] = useState({ ...emptyDemand, company: user.name, detail: "希望对接可产业化成果，解决关键材料或智能制造环节瓶颈。", budgetText: "100万元" });
  const [expertForm, setExpertForm] = useState({ ...emptyExpert, name: user.name, organization: "大学智能制造研究院", title: "教授级高工", field: "智能制造", keywords: "装备制造,工业互联网,成果转化" });
  const [achievementForm, setAchievementForm] = useState({ ...emptyAchievement, completer: user.name, organization: "大学智能制造研究院", field: "智能制造", stage: "中试阶段", transferMode: "联合开发/技术许可" });

  useEffect(() => { loadWorkbench(); }, [user.id]);

  async function loadWorkbench() {
    const result = await api.get(`/api/workbench/${user.id}`);
    setData(result);
  }

  async function saveEnterpriseProfile(event) {
    event.preventDefault();
    const result = await api.post("/api/enterprise/profile", { ...enterpriseForm, userId: user.id });
    setNotice(`企业介绍已更新：${result.profile.company}`);
    loadWorkbench();
  }

  async function publishWorkbenchDemand(event) {
    event.preventDefault();
    const result = await api.post("/api/demands", { ...demandForm, publisherId: user.id, company: enterpriseForm.company || user.name });
    setNotice(`需求已发布：${result.demand.name}`);
    onCreatedDemand(result.demand, result.matches);
  }

  async function saveExpertProfile(event) {
    event.preventDefault();
    const result = await api.post("/api/expert/profile", { ...expertForm, userId: user.id });
    setNotice(`专家画像已更新：${result.expert.name}`);
    loadWorkbench();
  }

  async function publishExpertAchievement(event) {
    event.preventDefault();
    const result = await api.post("/api/expert/achievements", { ...achievementForm, userId: user.id });
    setNotice(`成果已发布：${result.achievement.name}`);
    loadWorkbench();
  }

  if (!data) return React.createElement("section", { className: "panel" }, "正在加载工作台...");
  const stats = data.stats || {};

  if (user.role === "admin") {
    return React.createElement("div", { className: "role-workbench admin-workbench" },
      React.createElement("section", { className: "role-hero admin-hero" },
        React.createElement("div", null,
          React.createElement("span", { className: "eyebrow" }, "Administrator Overview"),
          React.createElement("h2", null, "管理员总览后台"),
          React.createElement("p", null, "管理员可以看到平台最完整的统计、三库数据、撮合会话和用户角色入口。")
        ),
        React.createElement("div", { className: "library-kpis" },
          libraryKpi("成果", stats.achievements),
          libraryKpi("需求", stats.demands),
          libraryKpi("专家", stats.experts),
          libraryKpi("经理人", stats.techManagers)
        )
      ),
      React.createElement("section", { className: "role-grid" },
        React.createElement("article", { className: "panel role-card" }, React.createElement("h3", null, "三库维护"), React.createElement("p", null, "添加、查看成果库、需求库、专家库字段。"), React.createElement("button", { className: "primary", onClick: () => go("admin") }, "进入管理后台")),
        React.createElement("article", { className: "panel role-card" }, React.createElement("h3", null, "撮合总览"), React.createElement("p", null, `已生成 ${stats.matches || 0} 条匹配记录，${stats.conversations || 0} 个会话。`), React.createElement("button", { className: "secondary", onClick: () => go("matches") }, "查看供需匹配")),
        React.createElement("article", { className: "panel role-card" }, React.createElement("h3", null, "磋商监管"), React.createElement("p", null, "管理员可进入全平台供需磋商室，查看企业、专家、经理人与智能体的沟通记录。"), React.createElement("button", { className: "secondary", onClick: () => go("negotiation") }, "进入磋商室")),
        React.createElement("article", { className: "panel role-card" }, React.createElement("h3", null, "前台展示"), React.createElement("p", null, "面向外部人员展示平台门户、三库资源和智能体能力。"), React.createElement("button", { className: "ghost", onClick: () => go("portal") }, "打开前台"))
      )
    );
  }

  if (user.role === "enterprise") {
    return React.createElement("div", { className: "role-workbench" },
      React.createElement(RoleHero, { title: "企业后台", subtitle: "科小企 Enterprise Agent", text: "企业可维护企业介绍、登记技术需求，并让科小企与专家智能体预沟通。" }),
      notice && React.createElement("div", { className: "admin-notice" }, notice),
      React.createElement("section", { className: "role-grid two" },
        React.createElement("form", { className: "panel form-grid admin-form-grid", onSubmit: saveEnterpriseProfile },
          React.createElement("h2", { className: "wide" }, "企业介绍"),
          workbenchInput("company", "企业名称", enterpriseForm, setEnterpriseForm),
          workbenchInput("industry", "所属产业", enterpriseForm, setEnterpriseForm),
          workbenchInput("region", "所在地区", enterpriseForm, setEnterpriseForm),
          workbenchInput("scale", "企业规模", enterpriseForm, setEnterpriseForm),
          workbenchInput("contact", "联系人", enterpriseForm, setEnterpriseForm),
          workbenchTextarea("intro", "企业简介与现有基础", enterpriseForm, setEnterpriseForm),
          React.createElement("button", { className: "primary wide" }, "保存企业介绍")
        ),
        React.createElement("form", { className: "panel form-grid admin-form-grid", onSubmit: publishWorkbenchDemand },
          React.createElement("h2", { className: "wide" }, "需求登记"),
          demandAdminFields.slice(0, 9).map((item) => adminField(item, demandForm[item[0]] || "", (value) => setDemandForm({ ...demandForm, [item[0]]: value }))),
          React.createElement("button", { className: "primary wide" }, "发布需求并智能匹配")
        )
      ),
      React.createElement(RoleAgentConsole, { role: "enterpriseAgent", nickname: "科小企", prompt: "请帮我把企业技术需求整理成可匹配专家的标准需求单，并模拟向专家发起第一轮追问。", counterpart: "科小专", onOpenRoom: () => go("negotiation") }),
      React.createElement(RoleAgentConsole, { role: "enterpriseCompanion", nickname: "企专伴", prompt: "请帮我做一次企业成长体检：判断我在技术升级、知识产权、高企/专精特新申报、产品迭代和专家咨询方面有哪些隐性需求。", counterpart: "科小企、科小经、政策顾问", onOpenRoom: () => go("negotiation") }),
      React.createElement(WorkbenchList, { title: "我的需求", items: data.myDemands, empty: "还没有发布需求" })
    );
  }

  if (user.role === "expert") {
    return React.createElement("div", { className: "role-workbench" },
      React.createElement(RoleHero, { title: "专家后台", subtitle: "科小专 Expert Agent", text: "专家可维护专家画像、发布科技成果，并让科小专回应企业智能体问题。" }),
      notice && React.createElement("div", { className: "admin-notice" }, notice),
      React.createElement("section", { className: "role-grid two" },
        React.createElement("form", { className: "panel form-grid admin-form-grid", onSubmit: saveExpertProfile },
          React.createElement("h2", { className: "wide" }, "专家信息"),
          expertFields.slice(1, 13).map((item) => adminField(item, expertForm[item[0]] || "", (value) => setExpertForm({ ...expertForm, [item[0]]: value }))),
          workbenchTextarea("bio", "个人简介", expertForm, setExpertForm),
          React.createElement("button", { className: "primary wide" }, "保存专家画像")
        ),
        React.createElement("form", { className: "panel form-grid admin-form-grid", onSubmit: publishExpertAchievement },
          React.createElement("h2", { className: "wide" }, "成果发布"),
          achievementFields.map((item) => adminField(item, achievementForm[item[0]] || "", (value) => setAchievementForm({ ...achievementForm, [item[0]]: value }))),
          React.createElement("button", { className: "primary wide" }, "发布成果")
        )
      ),
      React.createElement(RoleAgentConsole, { role: "expertAgent", nickname: "科小专", prompt: "请把我的成果包装成企业能看懂的转化方案，并准备回应企业关于成本、成熟度和交付周期的问题。", counterpart: "科小企", onOpenRoom: () => go("negotiation") }),
      React.createElement(WorkbenchList, { title: "我的成果", items: data.myAchievements, empty: "还没有发布成果" })
    );
  }

  return React.createElement("div", { className: "role-workbench" },
    React.createElement(RoleHero, { title: "技术经理人后台", subtitle: "科小经 Broker Agent", text: "技术经理人接收平台撮合任务，组织需求复核、专家邀约、样件验证和合同推进。" }),
    React.createElement("section", { className: "role-grid two" },
      React.createElement("div", { className: "panel manager-tasks" },
        React.createElement("h2", null, "我的撮合任务"),
        (data.managerTasks || []).map((task, index) => React.createElement("article", { className: "task-node", key: task.step },
          React.createElement("b", null, `0${index + 1}`),
          React.createElement("div", null,
            React.createElement("h3", null, task.step),
            React.createElement("span", { className: "tag accent" }, task.status),
            React.createElement("p", null, task.target),
            React.createElement("small", null, task.output)
          )
        ))
      ),
      React.createElement("div", { className: "panel role-card" },
        React.createElement("h3", null, "撮合流程"),
        ["接收企业需求", "科小经拆解任务", "邀约专家/成果方", "组织智能体预沟通", "生成纪要与合同要点"].map((item) => React.createElement("p", { key: item }, item)),
        React.createElement("button", { className: "primary", onClick: () => go("managers") }, "查看经理人推荐中心")
      )
    ),
    React.createElement(RoleAgentConsole, { role: "managerAgent", nickname: "科小经", prompt: "请根据当前需求生成技术经理人的撮合任务清单、访谈提纲和下一步推进计划。", counterpart: "科小企、科小专", onOpenRoom: () => go("negotiation") })
  );
}

function RoleHero({ title, subtitle, text }) {
  return React.createElement("section", { className: "role-hero" },
    React.createElement("span", { className: "eyebrow" }, subtitle),
    React.createElement("h2", null, title),
    React.createElement("p", null, text)
  );
}

function RoleAgentConsole({ role, nickname, prompt, counterpart, onOpenRoom }) {
  const [text, setText] = useState(prompt);
  const [messages, setMessages] = useState([{ sender: "specialist", text: `${nickname}：我已经就绪，可以和${counterpart}进行技术预沟通，也可以先帮你整理材料。` }]);
  const [duoMessages, setDuoMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duoLoading, setDuoLoading] = useState(false);
  const [duoAuto, setDuoAuto] = useState(false);

  useEffect(() => {
    if (!duoAuto || duoLoading) return undefined;
    if (duoMessages.length >= 6) {
      setDuoAuto(false);
      return undefined;
    }
    const timer = setTimeout(nextDuoLine, duoMessages.length ? 2400 : 500);
    return () => clearTimeout(timer);
  }, [duoAuto, duoLoading, duoMessages.length]);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    const question = text.trim();
    setMessages((items) => [...items, { sender: "user", text: question }]);
    setLoading(true);
    const result = await api.post("/api/agent-answer", { role, text: question, webSearch: true });
    setMessages((items) => [...items, { sender: "specialist", text: `${nickname}：${result.reply}` }]);
    setText("");
    setLoading(false);
  }
  async function nextDuoLine() {
    setDuoLoading(true);
    const currentIndex = duoMessages.length;
    const nextRole = role === "managerAgent"
      ? (currentIndex % 3 === 0 ? "managerAgent" : currentIndex % 3 === 1 ? "enterpriseAgent" : "expertAgent")
      : (currentIndex % 2 === 0 ? role : role === "enterpriseAgent" ? "expertAgent" : "enterpriseAgent");
    const result = await api.post("/api/role-agent-dialogue/next", {
      role: nextRole,
      history: duoMessages,
      webSearch: true
    });
    setDuoMessages((items) => [...items, { speaker: result.speaker, text: result.text, modelReady: result.modelReady }]);
    setDuoLoading(false);
  }
  return React.createElement("section", { className: "panel role-agent-console" },
    React.createElement("div", { className: "console-head" },
      React.createElement("div", { className: "agent-orb" }, nickname.slice(1, 2)),
      React.createElement("div", null, React.createElement("h3", null, `${nickname} 专属智能体`), React.createElement("p", null, `可与${counterpart}模拟真实业务洽谈，回答不会固定套话。`))
    ),
    React.createElement("div", { className: "messages specialist-messages" }, messages.map((item, index) =>
      React.createElement("div", { className: `message ${item.sender === "user" ? "enterprise" : "specialist"}`, key: index }, item.text)
    )),
    React.createElement("form", { className: "chat-form", onSubmit: submit },
      React.createElement("input", { value: text, onChange: (event) => setText(event.target.value), placeholder: prompt }),
      React.createElement("button", { className: "primary", disabled: loading }, loading ? "生成中" : "发送")
    ),
    React.createElement("div", { className: "agent-duo-box" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null,
        React.createElement("h3", null, "多智能体预沟通"),
        React.createElement("span", { className: "eyebrow" }, `${nickname} × ${counterpart}｜智能体逐句生成`)
      ),
        React.createElement("div", { className: "hero-actions" },
          React.createElement("button", { className: "ghost", type: "button", onClick: onOpenRoom }, "进入磋商室"),
          React.createElement("button", { className: duoAuto ? "primary" : "secondary", type: "button", onClick: () => setDuoAuto((value) => !value), disabled: duoLoading && !duoAuto }, duoAuto ? "暂停托管" : "智能体接管"),
          React.createElement("button", { className: "ghost", type: "button", onClick: nextDuoLine, disabled: duoLoading }, duoLoading ? "生成中" : "手动补一句")
        )
      ),
      React.createElement("div", { className: "messages staged-messages duo-messages" },
        duoMessages.length ? duoMessages.map((item, index) =>
          React.createElement("div", { className: `message ${item.speaker === "科小企" ? "enterpriseAgent" : item.speaker === "科小专" ? "expertAgent" : "agent"}`, key: index },
            React.createElement("b", null, `${item.speaker}：`),
            item.text
          )
        ) : React.createElement("div", { className: "empty" }, "点击“智能体接管”，系统会自动模拟双方智能体连续预沟通。")
      )
    )
  );
}

function WorkbenchList({ title, items, empty }) {
  return React.createElement("section", { className: "panel" },
    React.createElement("h2", null, title),
    React.createElement("div", { className: "admin-mini-list" },
      items?.length ? items.slice(0, 8).map((item) => React.createElement("article", { key: item.id },
        React.createElement("b", null, item.name),
        React.createElement("span", null, item.company || item.organization || item.field || "未填写")
      )) : React.createElement("p", null, empty)
    )
  );
}

function workbenchInput(key, label, form, setForm) {
  return field(label, React.createElement("input", { value: form[key] || "", onChange: (event) => setForm({ ...form, [key]: event.target.value }) }));
}

function workbenchTextarea(key, label, form, setForm) {
  return field(label, React.createElement("textarea", { value: form[key] || "", onChange: (event) => setForm({ ...form, [key]: event.target.value }) }), "wide");
}

function NegotiationRoom({ user, selectedDemand, conversation }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoReplying, setAutoReplying] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { loadRooms(false); }, [user.id]);
  useEffect(() => {
    if (!activeRoom?.id) return undefined;
    loadRoom(activeRoom.id);
    const timer = setInterval(() => loadRoom(activeRoom.id, true), 2500);
    return () => clearInterval(timer);
  }, [activeRoom?.id]);

  async function loadRooms(ensureRoom = false) {
    const result = await api.get(`/api/negotiation-rooms?userId=${user.id}`);
    if (result.rooms.length) {
      setRooms(result.rooms);
      if (!activeRoom) setActiveRoom(result.rooms.find((item) => item.id === conversation?.id) || result.rooms[0]);
      return;
    }
    setRooms([]);
    setActiveRoom(null);
    setMessages([]);
    if (ensureRoom) {
      const created = await api.post("/api/negotiation-rooms/start", { userId: user.id, demandId: selectedDemand?.id });
      setRooms([created.room]);
      setActiveRoom(created.room);
    }
  }

  async function loadRoom(id, quiet = false) {
    try {
      const result = await api.get(`/api/conversations/${id}`);
      setMessages(result.messages || []);
      if (!quiet) setNotice("");
    } catch (error) {
      if (!quiet) setNotice(error.message);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim() || !activeRoom) return;
    const text = draft.trim();
    const roomId = activeRoom.id;
    setDraft("");
    const result = await api.post(`/api/negotiation-rooms/${roomId}/messages`, { userId: user.id, text });
    setMessages((items) => [...items, result.message]);
    await loadRoom(roomId, true);
    const replyRole = user.role === "enterprise" ? "expertAgent" : user.role === "expert" ? "enterpriseAgent" : "";
    if (replyRole) {
      setAutoReplying(true);
      setTimeout(async () => {
        try {
          const reply = await api.post(`/api/negotiation-rooms/${roomId}/agent-step`, { userId: user.id, agentRole: replyRole, webSearch: true });
          setMessages((items) => [...items, reply.message]);
          await loadRoom(roomId, true);
        } catch (error) {
          setNotice(error.message);
        } finally {
          setAutoReplying(false);
        }
      }, 2200);
    }
  }

  async function startRoom() {
    setLoading(true);
    const created = await api.post("/api/negotiation-rooms/start", { userId: user.id, demandId: selectedDemand?.id, reset: true });
    setActiveRoom(created.room);
    setRooms((items) => [created.room, ...items.filter((item) => item.id !== created.room.id)]);
    await loadRoom(created.room.id);
    setLoading(false);
  }

  async function agentStep(agentRole) {
    if (!activeRoom) return;
    setLoading(true);
    const result = await api.post(`/api/negotiation-rooms/${activeRoom.id}/agent-step`, { userId: user.id, agentRole, webSearch: true });
    setMessages((items) => [...items, result.message]);
    await loadRoom(activeRoom.id, true);
    setLoading(false);
  }

  const room = activeRoom || rooms[0];
  const demand = room?.demand || {};
  const expert = room?.expert || {};
  const roleAgent = user.role === "expert" ? "expertAgent" : user.role === "manager" || user.role === "admin" ? "managerAgent" : "enterpriseAgent";
  const isAdmin = user.role === "admin";

  return React.createElement("div", { className: "negotiation-page" },
    React.createElement("section", { className: "negotiation-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "One-to-One Matching Room"),
        React.createElement("h2", null, isAdmin ? "平台磋商监管室" : "供需双方智能体磋商室"),
        React.createElement("p", null, isAdmin ? "管理员可查看全平台一对一供需匹配房间，必要时让科小企、科小专、科小经分别补充发言，形成监管和服务记录。" : "这里不是单页演示，而是一对一供需匹配房间。企业端、专家端登录后进入同一房间，消息会存档并同步刷新。")
      ),
      React.createElement("button", { className: "primary", onClick: startRoom, disabled: loading }, loading ? "进入中" : isAdmin ? "新建监管房间" : "新建空白磋商室")
    ),
    notice && React.createElement("div", { className: "admin-notice" }, notice),
    React.createElement("section", { className: "negotiation-layout" },
      React.createElement("aside", { className: "panel room-list" },
        React.createElement("h2", null, "磋商房间"),
        rooms.map((item) => React.createElement("button", {
          key: item.id,
          className: room?.id === item.id ? "active" : "",
          onClick: () => setActiveRoom(item)
        },
          React.createElement("b", null, item.demand?.name || item.title),
          React.createElement("span", null, `${item.demand?.company || "企业方"} × ${item.expert?.name || "专家方"}`),
          React.createElement("small", null, `${item.messageCount || 0}条记录｜匹配${item.matchScore || "--"}%`)
        ))
      ),
      React.createElement("main", { className: "panel negotiation-chat" },
        React.createElement("div", { className: "negotiation-title" },
          React.createElement("div", null,
            React.createElement("h2", null, room?.title || "等待建立磋商室"),
            React.createElement("span", { className: "eyebrow" }, room ? `${demand.company || "企业"}｜${expert.organization || "专家单位"}｜${room.status || "磋商中"}` : "请选择或新建房间")
          ),
          React.createElement("div", { className: "hero-actions" },
            isAdmin && React.createElement("button", { className: "ghost", disabled: loading || !room, onClick: () => agentStep("enterpriseAgent") }, "科小企发言"),
            isAdmin && React.createElement("button", { className: "ghost", disabled: loading || !room, onClick: () => agentStep("expertAgent") }, "科小专发言"),
            isAdmin && React.createElement("button", { className: "ghost", disabled: loading || !room, onClick: () => agentStep("managerAgent") }, "科小经监管"),
            autoReplying && React.createElement("span", { className: "auto-reply-indicator" }, "对方智能体思考中...")
          )
        ),
        React.createElement("div", { className: "messages negotiation-messages" },
          messages.length ? messages.map((item) => React.createElement("div", { className: `message ${item.sender}`, key: item.id },
            React.createElement("b", null, item.speaker || speakerName(item.sender)),
            React.createElement("p", null, item.text),
            React.createElement("small", null, formatTime(item.createdAt))
          )) : React.createElement("div", { className: "empty" }, "还没有磋商记录。直接发送一条消息开始，对方智能体会自动回复。")
        ),
        React.createElement("form", { className: "chat-form negotiation-input", onSubmit: sendMessage },
          React.createElement("input", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: isAdmin ? "管理员输入：记录监管意见、服务建议或要求双方补充材料" : user.role === "expert" ? "专家方输入：请说明技术成熟度、验证条件或合作边界" : "企业方输入：请追问成本、交付、质量责任或验证计划" }),
          React.createElement("button", { className: "primary", disabled: !room }, "发送")
        )
      ),
      React.createElement("aside", { className: "panel negotiation-brief" },
        React.createElement("h2", null, "匹配判断"),
        React.createElement("div", { className: "match-ring compact" },
          React.createElement("strong", null, `${room?.matchScore || "--"}%`),
          React.createElement("span", null, "适配度")
        ),
        React.createElement("p", null, room?.matchReason || "建立房间后生成匹配理由。"),
        React.createElement("h3", null, "企业关心"),
        ["指标是否达成", "样件/数据能否开放", "成本与交付周期", "质量责任与售后", "知识产权边界"].map((item) => React.createElement("span", { className: "tag", key: item }, item)),
        React.createElement("h3", null, "专家关心"),
        ["需求是否真实", "预算是否匹配", "验证条件是否具备", "成果许可方式", "联合开发分工"].map((item) => React.createElement("span", { className: "tag accent", key: item }, item)),
        React.createElement("h3", null, "下一步"),
        ["确认NDA", "交换测试样件/数据", "形成技术验证方案", "约定报价与交付", "生成对接纪要"].map((item, index) =>
          React.createElement("p", { className: "brief-step", key: item }, `${index + 1}. ${item}`)
        )
      )
    )
  );
}

function speakerName(sender) {
  return { enterprise: "企业方", expert: "专家方", enterpriseAgent: "科小企", expertAgent: "科小专", managerAgent: "科小经", system: "系统" }[sender] || "平台";
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function PortalHome({ user, go }) {
  const [heroQuestion, setHeroQuestion] = useState("");
  const [heroAnswer, setHeroAnswer] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("我有技术需求");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/api/dashboard").then(setDashboard);
  }, []);

  async function askKexiaoguo(text = heroQuestion) {
    const question = text.trim();
    if (!question) return;
    setHeroQuestion(question);
    setHeroLoading(true);
    setHeroAnswer("");
    try {
      const result = await api.post("/api/agent-answer", { role: "transferOfficer", text: question, webSearch: true });
      setHeroAnswer(result.reply);
    } catch (error) {
      setHeroAnswer("科小果暂时没有连上模型，请稍后再试。");
    } finally {
      setHeroLoading(false);
    }
  }

  return React.createElement("div", { className: "portal" },
    React.createElement(SideToolDock, { user, go }),
    React.createElement("section", { className: "portal-hero" },
      React.createElement("div", { className: "hero-main-copy" },
        React.createElement("span", { className: "eyebrow hero-eyebrow" }, "长三角协同创新"),
        React.createElement("h2", null, "让技术找到场景，让成果走向产业"),
        React.createElement("h3", null, "一站式连接企业需求、科技成果、领域专家与技术经理人"),
        React.createElement("div", { className: "hero-ai-card nstl-search-card" },
          React.createElement("div", { className: "hero-ai-head" },
            React.createElement("b", null, searchMode),
            React.createElement("span", null, "科小果联网检索 · 智能推荐")
          ),
          React.createElement("div", { className: "search-mode-tabs" },
            ["我有技术需求", "我有技术成果", "智能匹配"].map((item) =>
              React.createElement("button", { type: "button", className: searchMode === item ? "active" : "", key: item, onClick: () => setSearchMode(item) }, item)
            )
          ),
          React.createElement("form", { className: "hero-ai-input", onSubmit: (event) => { event.preventDefault(); askKexiaoguo(); } },
            React.createElement("input", {
              value: heroQuestion,
              onChange: (event) => setHeroQuestion(event.target.value),
              placeholder: searchMode === "我有技术成果" ? "描述您的技术成果、成熟度、应用场景..." : searchMode === "智能匹配" ? "输入技术关键词，查找适配成果、专家和企业需求..." : "描述您的技术需求、指标、预算或应用场景..."
            }),
            React.createElement("button", { disabled: heroLoading }, heroLoading ? "匹配中" : "智能匹配")
          ),
          React.createElement("div", { className: "resource-checks" },
            ["新能源", "人工智能", "生物医药", "新材料", "智能制造"].map((item) => React.createElement("span", { key: item }, item))
          ),
          heroAnswer && React.createElement("div", { className: "hero-ai-answer" }, heroAnswer)
        ),
        React.createElement("div", { className: "hero-actions hero-actions-premium" },
          user.role === "enterprise"
            ? React.createElement("button", { className: "primary", onClick: () => go("publish") }, "发布需求")
            : React.createElement("button", { className: "primary", onClick: () => go("workspace") }, user.role === "expert" ? "进入专家后台" : user.role === "manager" ? "查看撮合任务" : "进入管理后台"),
          React.createElement("button", { className: "secondary", onClick: () => go(user.role === "expert" ? "workspace" : "achievements") }, user.role === "expert" ? "登记成果" : "成果库"),
          React.createElement("button", { className: "ghost hero-ghost", onClick: () => go("agents") }, "进入智能体广场")
        )
      ),
      React.createElement("aside", { className: "hero-focus-card" },
        React.createElement("span", { className: "eyebrow" }, "TODAY'S FOCUS"),
        React.createElement("h3", null, "今日重点对接"),
        React.createElement("strong", null, "特种铝合金 × 无人装备轻量化"),
        React.createElement("p", null, "已完成需求解析与专家召回，正在组织技术指标复核和样件验证。"),
        React.createElement("div", { className: "focus-progress" },
          ["需求确认", "专家匹配", "技术洽谈", "样件验证"].map((item, index) =>
            React.createElement("span", { className: index < 3 ? "done" : "", key: item }, item)
          )
        ),
        React.createElement("button", { className: "secondary", onClick: () => go("demo") }, "查看对接进展")
      )
    ),
    React.createElement("section", { className: "portal-band" },
      [
        ["成果资源", dashboard?.achievements || "1.1万+"],
        ["企业需求", dashboard?.demands ?? demoTotals.demands],
        ["专家资源", dashboard?.experts ?? demoTotals.experts],
        ["技术经理人", dashboard?.techManagers ?? demoTotals.techManagers],
        ["智能匹配", dashboard?.matches ?? demoTotals.matches]
      ].map((item) =>
        React.createElement("div", { className: "portal-stat", key: item },
          React.createElement("strong", null, item[1]),
          React.createElement("span", null, item[0])
        )
      )
    )
  );
}

function LeadershipCockpit({ data, go }) {
  const kpis = [
    ["成果库", data?.achievements || "1.1万+", "高校院所成果沉淀"],
    ["企业需求", data?.demands ?? demoTotals.demands, "真实需求与揭榜线索"],
    ["技术经理人", data?.techManagers ?? demoTotals.techManagers, "可承接撮合服务"],
    ["AI匹配成功", data?.matches ?? demoTotals.matches, "自动推荐与磋商记录"],
    ["潜在转化金额", "12.6亿", "按预算与案例估算"],
    ["重点产业链", "6条", "优势方向覆盖"]
  ];
  return React.createElement("section", { className: "leadership-cockpit" },
    React.createElement("div", { className: "cockpit-copy" },
      React.createElement("span", { className: "eyebrow" }, "科技成果转化态势"),
      React.createElement("h2", null, "成果转化智能态势中心"),
      React.createElement("div", { className: "cockpit-status-strip" },
        ["实时撮合 45", "活跃地市 12", "产业链 6", "预计转化 12.6亿"].map((item) => React.createElement("span", { key: item }, item))
      ),
      React.createElement("div", { className: "hero-actions" },
        React.createElement("button", { className: "primary", onClick: () => go("dashboard") }, "查看数据看板"),
        React.createElement("button", { className: "secondary", onClick: () => go("demo") }, "演示模式"),
        React.createElement("button", { className: "ghost", onClick: () => go("negotiation") }, "磋商监管")
      )
    ),
    React.createElement("div", { className: "province-map-card" },
      React.createElement("div", { className: "province-map" },
        React.createElement("div", { className: "radar-sweep" }),
        React.createElement("svg", { className: "region-svg-map", viewBox: "0 0 520 430", role: "img", "aria-label": "科技成果转化热力图" },
          React.createElement("defs", null,
            React.createElement("linearGradient", { id: "regionMapFill", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
              React.createElement("stop", { offset: "0%", stopColor: "#d8ecf7", stopOpacity: "0.95" }),
              React.createElement("stop", { offset: "52%", stopColor: "#7bb9dc", stopOpacity: "0.88" }),
              React.createElement("stop", { offset: "100%", stopColor: "#183b66", stopOpacity: "0.78" })
            ),
            React.createElement("radialGradient", { id: "regionHot", cx: "50%", cy: "50%", r: "58%" },
              React.createElement("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.95" }),
              React.createElement("stop", { offset: "44%", stopColor: "#9fd3ef", stopOpacity: "0.52" }),
              React.createElement("stop", { offset: "100%", stopColor: "#183b66", stopOpacity: "0.08" })
            ),
            React.createElement("filter", { id: "mapGlow", x: "-30%", y: "-30%", width: "160%", height: "160%" },
              React.createElement("feGaussianBlur", { stdDeviation: "7", result: "blur" }),
              React.createElement("feMerge", null,
                React.createElement("feMergeNode", { in: "blur" }),
                React.createElement("feMergeNode", { in: "SourceGraphic" })
              )
            )
          ),
          React.createElement("path", { className: "region-outline-shadow", d: "M245 24 L292 38 L324 70 L390 56 L450 82 L432 134 L485 162 L468 225 L430 254 L444 314 L384 334 L350 390 L295 374 L240 406 L192 354 L125 348 L72 300 L36 248 L78 190 L62 132 L128 112 L158 56 Z" }),
          React.createElement("g", { className: "region-districts" },
            React.createElement("path", { className: "region-district d1", d: "M158 56 L245 24 L292 38 L324 70 L286 118 L210 122 L128 112 Z" }),
            React.createElement("path", { className: "region-district d2", d: "M324 70 L390 56 L450 82 L432 134 L372 146 L286 118 Z" }),
            React.createElement("path", { className: "region-district d3", d: "M62 132 L128 112 L210 122 L188 190 L118 210 L78 190 Z" }),
            React.createElement("path", { className: "region-district d4", d: "M210 122 L286 118 L372 146 L342 212 L260 210 L188 190 Z" }),
            React.createElement("path", { className: "region-district d5", d: "M372 146 L432 134 L485 162 L468 225 L410 238 L342 212 Z" }),
            React.createElement("path", { className: "region-district d6", d: "M78 190 L118 210 L188 190 L184 272 L116 286 L36 248 Z" }),
            React.createElement("path", { className: "region-district d7", d: "M188 190 L260 210 L244 286 L184 272 Z" }),
            React.createElement("path", { className: "region-district d8", d: "M260 210 L342 212 L326 282 L244 286 Z" }),
            React.createElement("path", { className: "region-district d9", d: "M342 212 L410 238 L444 314 L384 334 L326 282 Z" }),
            React.createElement("path", { className: "region-district d10", d: "M36 248 L116 286 L125 348 L72 300 Z" }),
            React.createElement("path", { className: "region-district d11", d: "M116 286 L184 272 L244 286 L240 406 L192 354 L125 348 Z" }),
            React.createElement("path", { className: "region-district d12", d: "M244 286 L326 282 L384 334 L350 390 L295 374 L240 406 Z" })
          ),
          React.createElement("circle", { className: "heat-core zhengzhou", cx: "260", cy: "210", r: "58" }),
          React.createElement("circle", { className: "heat-core luoyang", cx: "128", cy: "214", r: "38" }),
          React.createElement("circle", { className: "heat-core xinxiang", cx: "292", cy: "116", r: "34" }),
          React.createElement("circle", { className: "heat-core xuchang", cx: "304", cy: "260", r: "34" }),
          React.createElement("circle", { className: "heat-core nanyang", cx: "178", cy: "318", r: "40" }),
          React.createElement("path", { className: "flow-line", d: "M260 210 C322 184 382 166 500 132" }),
          React.createElement("path", { className: "flow-line delay", d: "M260 210 C340 246 400 294 486 368" }),
          React.createElement("path", { className: "flow-line slow", d: "M134 208 C188 218 224 224 260 210" })
        ),
        [["", "32%"], ["", "18%"], ["", "12%"], ["", "11%"], ["", "9%"], ["长三角", "27%"]].map((city, index) =>
          React.createElement("span", { className: `city-dot c${index + 1}`, key: city[0] },
            React.createElement("b", null, city[0]),
            React.createElement("em", null, city[1])
          )
        ),
        React.createElement("strong", null, ""),
        React.createElement("div", { className: "map-route r1" }),
        React.createElement("div", { className: "map-route r2" }),
        React.createElement("div", { className: "map-route r3" })
      ),
      React.createElement("div", { className: "city-activity" },
        ["", "", "", "", "", "长三角"].map((item) =>
          React.createElement("span", { key: item }, item)
        )
      )
    ),
    React.createElement("div", { className: "cockpit-kpis" },
      kpis.map((item) => React.createElement("article", { key: item[0] },
        React.createElement("span", null, item[0]),
        React.createElement("strong", null, item[1]),
        React.createElement("small", null, item[2])
      ))
    ),
    React.createElement("div", { className: "data-visual-wall" },
      React.createElement("section", { className: "visual-card chain-bars" },
        React.createElement("h3", null, "重点产业链覆盖"),
        [["先进制造", 92], ["新材料", 88], ["现代农业", 76], ["生物医药", 72], ["电子信息", 68], ["新能源", 64]].map((item) =>
          React.createElement("div", { className: "bar-row", key: item[0] },
            React.createElement("span", null, item[0]),
            React.createElement("i", null, React.createElement("b", { style: { width: `${item[1]}%` } })),
            React.createElement("em", null, `${item[1]}%`)
          )
        )
      ),
      React.createElement("section", { className: "visual-card match-funnel" },
        React.createElement("h3", null, "AI撮合漏斗"),
        [["需求解析", 100], ["成果召回", 82], ["专家确认", 64], ["经理人跟进", 41], ["进入验证", 23]].map((item) =>
          React.createElement("div", { className: "funnel-row", style: { "--w": `${item[1]}%` }, key: item[0] },
            React.createElement("span", null, item[0]),
            React.createElement("b", null, item[1])
          )
        )
      ),
      React.createElement("section", { className: "visual-card live-ticker" },
        React.createElement("h3", null, "实时转化事件"),
        ["新材料需求完成AI解析", "装备企业进入样件验证", "长三角专家确认可对接范围", "科小经生成尽调清单", "政策智能体推荐揭榜挂帅路径"].map((item, index) =>
          React.createElement("p", { key: item },
            React.createElement("time", null, `T+0${index + 1}`),
            React.createElement("span", null, item)
          )
        )
      )
    )
  );
}

function DemoModePanel({ go }) {
  const steps = [
    ["需求入库", "无人装备 · 新材料"],
    ["AI解析", "指标 / 预算 / 风险"],
    ["成果召回", "高校院所 / 专家团队"],
    ["经理人方案", "尽调 / 样件 / 合同"],
    ["报告输出", "路径 / 政策 / 资金"]
  ];
  return React.createElement("section", { className: "demo-mode-panel" },
    React.createElement("div", null,
      React.createElement("span", { className: "eyebrow" }, "AI DEMO"),
      React.createElement("h2", null, "撮合闭环")
    ),
    React.createElement("div", { className: "demo-flow-rail" },
      steps.map((step, index) => React.createElement("article", { className: index < 4 ? "active" : "", key: step[0] },
        React.createElement("b", null, `0${index + 1}`),
        React.createElement("strong", null, step[0]),
        React.createElement("span", null, step[1])
      ))
    ),
    React.createElement("button", { className: "primary", onClick: () => go("demo") }, "启动")
  );
}

function AgentCollaborationMap() {
  const agents = [
    ["科小企", "需求解析", "抽取痛点、真实性、预算边界", "91%", "企"],
    ["果小转", "成果推荐", "生成成果画像并召回高校院所", "87%", "果"],
    ["科小专", "专家响应", "确认成熟度、样件和技术边界", "84%", "专"],
    ["科小经", "经理人撮合", "拆解尽调清单与合同要点", "93%", "经"],
    ["策小通", "政策路径", "推荐揭榜挂帅、高企、奖补", "76%", "策"],
    ["融小桥", "资金建议", "匹配基金和科技金融产品", "72%", "融"]
  ];
  const streams = [
    ["需求指标", "科小企 -> 果小转"],
    ["成果证据", "果小转 -> 科小专"],
    ["尽调清单", "科小专 -> 科小经"],
    ["政策资金", "策小通 / 融小桥"]
  ];
  const timeline = [
    ["01", "需求画像完成", "轻量化、耐腐蚀、量产稳定性"],
    ["02", "成果召回中", "高校成果 7 项 / 专家团队 5 个"],
    ["03", "经理人介入", "样件验证、NDA、报价口径"],
    ["04", "报告生成", "路径、风险、政策、资金建议"]
  ];
  return React.createElement("section", { className: "agent-collab-map" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "Multi-Agent Collaboration"),
        React.createElement("h2", null, "多智能体协同推理面板")
      ),
      React.createElement("strong", null, "最终输出：转化撮合报告")
    ),
    React.createElement("div", { className: "agent-orbit-map" },
      React.createElement("div", { className: "agent-grid-bg" }),
      React.createElement("svg", { className: "agent-link-svg", viewBox: "0 0 1000 430", preserveAspectRatio: "none", "aria-hidden": "true" },
        React.createElement("defs", null,
          React.createElement("linearGradient", { id: "agentLineA", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            React.createElement("stop", { offset: "0%", stopColor: "#67e8f9", stopOpacity: "0.05" }),
            React.createElement("stop", { offset: "45%", stopColor: "#67e8f9", stopOpacity: "0.9" }),
            React.createElement("stop", { offset: "100%", stopColor: "#a78bfa", stopOpacity: "0.08" })
          )
        ),
        React.createElement("path", { className: "agent-link l1", d: "M150 120 C320 120 370 190 500 215 C620 240 690 130 850 140" }),
        React.createElement("path", { className: "agent-link l2", d: "M165 320 C300 250 390 260 500 215 C635 160 690 320 830 315" }),
        React.createElement("path", { className: "agent-link l3", d: "M500 65 C470 145 470 270 500 365" }),
        React.createElement("path", { className: "agent-link l4", d: "M500 215 C620 210 710 228 890 224" })
      ),
      React.createElement("div", { className: "report-core" },
        React.createElement("span", null, "AI"),
        React.createElement("b", null, "撮合报告"),
        React.createElement("small", null, "生成中")
      ),
      React.createElement("div", { className: "agent-data-packet p1" }, "需求画像"),
      React.createElement("div", { className: "agent-data-packet p2" }, "成果证据"),
      React.createElement("div", { className: "agent-data-packet p3" }, "政策资金"),
      React.createElement("div", { className: "agent-data-packet p4" }, "尽调建议"),
      agents.map((agent, index) => React.createElement("article", { className: `agent-node a${index + 1}`, key: agent[0] },
        React.createElement("i", null, agent[4]),
        React.createElement("div", null,
          React.createElement("b", null, agent[0]),
          React.createElement("span", null, agent[1])
        ),
        React.createElement("small", null, agent[2])
      )),
      React.createElement("div", { className: "collab-stream-board" },
        streams.map((item, index) => React.createElement("p", { key: item[0], className: index === 0 ? "active" : "" },
          React.createElement("b", null, item[0]),
          React.createElement("span", null, item[1])
        ))
      ),
      React.createElement("div", { className: "collab-timeline" },
        timeline.map((item, index) => React.createElement("p", { key: item[0], className: index < 3 ? "done" : "" },
          React.createElement("time", null, item[0]),
          React.createElement("b", null, item[1]),
          React.createElement("span", null, item[2])
        ))
      )
    )
  );
}

function IndustryChainScenes({ go }) {
  const chains = [
    ["先进制造", "42项成果", "18条需求", "机器人、数控、传感器", "首台套/智能工厂"],
    ["新材料", "36项成果", "16条需求", "铝合金、复材、膜材料", "首批次新材料"],
    ["现代农业", "28项成果", "12条需求", "智慧农业、种业、植保", "农业科技项目"],
    ["生物医药", "31项成果", "9条需求", "细胞、药筛、康复", "临床/注册风险"],
    ["电子信息", "24项成果", "11条需求", "芯片、MEMS、工业软件", "概念验证"],
    ["新能源", "22项成果", "10条需求", "储能、氢能、低碳", "绿色低碳基金"]
  ];
  return React.createElement("section", { className: "industry-chain-scenes" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "重点产业链"),
        React.createElement("h2", null, "按产业链组织成果、需求、专家和政策资金")
      )
    ),
    React.createElement("div", { className: "chain-grid" },
      chains.map((item) => React.createElement("article", { key: item[0], onClick: () => go("matches") },
        React.createElement("h3", null, item[0]),
        React.createElement("div", null, React.createElement("b", null, item[1]), React.createElement("b", null, item[2])),
        React.createElement("p", null, item[3]),
        React.createElement("span", null, item[4])
      ))
    )
  );
}

function SuccessCaseCards({ go }) {
  const cases = [
    ["无人装备轻量化材料", "长三角无人装备企业", "科学院/新材料团队", "技术经理人介入", "预计新增产值 1.8亿"],
    ["农业大棚高强棚膜", "豫北设施农业企业", "大学材料团队", "直接推荐专家", "预计降本 12%"],
    ["冷链品质追溯标签", "食品企业", "江南大学食品团队", "政策+金融联动", "融资需求 800万"]
  ];
  return React.createElement("section", { className: "success-case-section" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "转化案例"),
        React.createElement("h2", null, "项目进展卡片")
      ),
      React.createElement("button", { className: "secondary", onClick: () => go("demo") }, "查看完整演示")
    ),
    React.createElement("div", { className: "success-case-grid" },
      cases.map((item) => React.createElement("article", { key: item[0] },
        React.createElement("span", null, item[0]),
        React.createElement("h3", null, `${item[1]} × ${item[2]}`),
        React.createElement("p", null, `${item[3]}，平台输出技术路径、风险提示、合作建议和政策资金方案。`),
        React.createElement("strong", null, item[4])
      ))
    )
  );
}

function SideToolDock({ user, go }) {
  const roleTool = user.role === "enterprise"
    ? ["需求发布", "publish"]
    : user.role === "expert"
      ? ["成果发布", "workspace"]
      : user.role === "manager"
        ? ["撮合任务", "workspace"]
        : ["管理后台", "admin"];
  const tools = [
    ["成果检索", "achievements"],
    roleTool,
    ["找专家", "experts"],
    ["科小果", "agents"],
    ["经理人", "managers"],
    ["数据看板", "dashboard"]
  ];
  return React.createElement("aside", { className: "side-tool-dock" },
    tools.map(([label, page]) => React.createElement("button", { key: label, onClick: () => go(page) }, label))
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/api/dashboard").then(setData); }, []);
  if (!data) return React.createElement("div", { className: "empty" }, "加载中");
  return React.createElement("div", { className: "grid" },
    React.createElement("div", { className: "grid stats" }, [
      ["成果库", data.achievements],
      ["需求库", data.demands],
      ["专家库", data.experts],
      ["技术经理人", data.techManagers || 0],
      ["累计匹配", data.matches]
    ].map(([label, value]) => React.createElement("div", { className: "stat", key: label }, React.createElement("span", null, label), React.createElement("strong", null, value)))),
    React.createElement("div", { className: "layout-two" },
      React.createElement("section", { className: "panel" },
        React.createElement("div", { className: "panel-header" },
          React.createElement("div", null, React.createElement("h2", null, "近期匹配记录"), React.createElement("span", { className: "eyebrow" }, "记录每次推荐，用于后续算法优化"))
        ),
        React.createElement("div", { className: "list" }, data.latestMatches.length ? data.latestMatches.map((item) =>
          React.createElement("article", { className: "card", key: item.id },
            React.createElement("div", { className: "match-row" },
              React.createElement("div", null, React.createElement("h3", null, item.demandName), React.createElement("p", null, `${item.expertName} · ${item.reason}`)),
              React.createElement("div", { className: "score" }, `${item.score}%`)
            )
          )
        ) : React.createElement("div", { className: "empty" }, "发布需求后将生成匹配记录"))
      ),
      React.createElement("section", { className: "panel" },
        React.createElement("h2", null, "活跃度指标"),
        React.createElement("div", { className: "list" }, data.activity.map((item) =>
          React.createElement("div", { className: "card", key: item.label }, React.createElement("span", { className: "eyebrow" }, item.label), React.createElement("h3", null, item.value))
        ))
      )
    ),
    React.createElement("section", { className: "panel" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null, React.createElement("h2", null, "平台流程演示"), React.createElement("span", { className: "eyebrow" }, "需求发布、专家匹配、智能体对话、转化跟踪"))
      ),
      React.createElement("div", { className: "video-strip" },
        ["企业发布需求", "算法推荐专家", "智能体自动沟通", "形成转化纪要"].map((item, index) =>
          React.createElement("div", { className: "video-step", key: item },
            React.createElement("b", null, `0${index + 1}`),
            React.createElement("span", null, item)
          )
        )
      )
    )
  );
}

function PublishDemand({ user, onCreated }) {
  const [form, setForm] = useState({ ...emptyDemand });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [authorizing, setAuthorizing] = useState(false);

  useEffect(() => {
    if (!submitted || authorizing) return undefined;
    setAuthorizing(true);
    const timer = setTimeout(() => {
      onCreated(submitted.demand, submitted.matches, { complexity: submitted.complexity, managers: submitted.managers || [] });
    }, 1800);
    return () => clearTimeout(timer);
  }, [submitted?.demand?.id]);

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    const result = await api.post("/api/demands", { ...form, budget: form.budgetAmount, publisherId: user.id });
    setSaving(false);
    setSubmitted(result);
  }

  function authorizeMatching() {
    if (!submitted) return;
    setAuthorizing(true);
    setTimeout(() => onCreated(submitted.demand, submitted.matches, { complexity: submitted.complexity, managers: submitted.managers || [] }), 550);
  }

  return React.createElement("section", { className: "panel" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null, React.createElement("h2", null, "发布企业技术需求"), React.createElement("span", { className: "eyebrow" }, "提交后智能体将立即推荐3-5位专家"))
    ),
    submitted && React.createElement("div", { className: "onsite-auth-card" },
      React.createElement("div", { className: "auth-agent-head" },
        React.createElement("span", { className: "agent-orb small" }, "企"),
        React.createElement("div", null,
          React.createElement("h3", null, "智能体已接管现场需求"),
          React.createElement("p", null, `需求《${submitted.demand.name}》已入库。科小企正在自动解析需求、召回专家/成果、向对方智能体发起确认，不需要你一步步点击。`)
        )
      ),
      React.createElement("div", { className: "auth-pipeline" },
        ["需求入库", "科小企解析", submitted.complexity?.route === "manager-led" ? "经理人介入" : "专家/成果召回", "自动授权推荐", "双方智能体确认"].map((step, index) =>
          React.createElement("span", { className: index < 3 ? "done" : index === 3 ? "active" : "", key: step }, step)
        )
      ),
      submitted.complexity && React.createElement("div", { className: "algorithm-route-card" },
        React.createElement("b", null, submitted.complexity.routeLabel),
        React.createElement("span", null, `复杂度 ${submitted.complexity.complexityScore}/100`),
        React.createElement("p", null, submitted.complexity.reasons.join("；")),
        submitted.managers?.length > 0 && React.createElement("div", { className: "manager-mini-list" },
          submitted.managers.map((manager) => React.createElement("span", { key: manager.id }, `${manager.name} ${manager.recommendScore || manager.responseRate}%`))
        )
      ),
      React.createElement("div", { className: "onsite-match-grid" },
        submitted.matches.slice(0, 4).map((expert, index) =>
          React.createElement("article", { className: index === 0 ? "onsite-match-card best" : "onsite-match-card", key: expert.id },
            React.createElement("div", { className: "match-row" },
              React.createElement("div", null,
                React.createElement("b", null, expert.name),
                React.createElement("span", null, `${expert.organization}｜${expert.field}`)
              ),
              React.createElement("strong", null, `${expert.matchScore}%`)
            ),
            React.createElement("p", null, expert.reason),
            React.createElement("small", null, index === 0 ? "建议现场优先授权对接" : "可作为备选推荐对象")
          )
        )
      ),
      React.createElement("div", { className: "authorization-consent" },
        React.createElement("div", null, React.createElement("b", null, "企业侧"), React.createElement("span", null, "科小企托管")),
        React.createElement("div", null, React.createElement("b", null, "专家侧"), React.createElement("span", null, "科小专自动确认")),
        React.createElement("div", null, React.createElement("b", null, "平台侧"), React.createElement("span", null, "自动生成对接纪要"))
      ),
      React.createElement("div", { className: "hero-actions" },
        React.createElement("button", { className: "primary", onClick: authorizeMatching, disabled: authorizing }, authorizing ? "智能体接管中..." : "立即查看接管结果"),
        React.createElement("button", { className: "ghost", onClick: () => setSubmitted(null), disabled: authorizing }, "返回继续修改")
      )
    ),
    React.createElement("form", { className: "form-grid", onSubmit: submit },
      field("需求名称", React.createElement("input", { required: true, value: form.name, onChange: (e) => update("name", e.target.value), placeholder: "例如：高端装备故障预测与能耗优化" })),
      field("所属单位或公司名称", React.createElement("input", { value: form.company, onChange: (e) => update("company", e.target.value) })),
      field("技术领域", React.createElement("select", { value: form.field, onChange: (e) => update("field", e.target.value) }, ["智能制造", "新材料", "生物医药", "人工智能", "节能环保", "新能源", "安全应急", "现代食品"].map((item) => React.createElement("option", { key: item }, item)))),
      field("所属地区", React.createElement("input", { value: form.region, onChange: (e) => update("region", e.target.value) })),
      field("技术指标", React.createElement("textarea", { required: true, value: form.technicalIndicators, onChange: (e) => update("technicalIndicators", e.target.value) }), "wide"),
      field("拟解决的技术难题", React.createElement("textarea", { required: true, value: form.problem, onChange: (e) => update("problem", e.target.value) }), "wide"),
      field("现有基础条件", React.createElement("textarea", { value: form.foundation, onChange: (e) => update("foundation", e.target.value) }), "wide"),
      field("预算金额", React.createElement("input", { type: "number", value: form.budgetAmount, onChange: (e) => update("budgetAmount", e.target.value) })),
      field("合作方式", React.createElement("select", { value: form.cooperation, onChange: (e) => update("cooperation", e.target.value) }, ["联合开发", "委托研发", "技术许可", "成果转让", "作价入股"].map((item) => React.createElement("option", { key: item }, item)))),
      field("单位性质", React.createElement("select", { value: form.orgType, onChange: (e) => update("orgType", e.target.value) }, ["民营企业", "国有企业", "科研院所", "高校", "园区平台"].map((item) => React.createElement("option", { key: item }, item)))),
      field("需求类型", React.createElement("input", { value: form.demandType, onChange: (e) => update("demandType", e.target.value) })),
      field("有效期", React.createElement("input", { type: "date", value: form.validUntil, onChange: (e) => update("validUntil", e.target.value) })),
      field("信息来源", React.createElement("input", { value: form.source, onChange: (e) => update("source", e.target.value) })),
      field("需求关键词", React.createElement("input", { value: form.keywords, onChange: (e) => update("keywords", e.target.value), placeholder: "用逗号分隔" })),
      React.createElement("div", { className: "wide" }, React.createElement("button", { className: "primary", disabled: saving }, saving ? "匹配中..." : "发布并智能匹配"))
    )
  );
}

function Matches({ demands, selectedDemand, matches, matchMeta, onSelect, onStart }) {
  const [activeExpert, setActiveExpert] = useState(null);
  const [reportPreview, setReportPreview] = useState("");
  const [demandQuery, setDemandQuery] = useState(selectedDemand?.name || "");
  const [showDemandResults, setShowDemandResults] = useState(false);
  useEffect(() => {
    setDemandQuery(selectedDemand?.name || "");
  }, [selectedDemand?.id]);
  const filteredDemandOptions = useMemo(() => {
    const query = demandQuery.trim().toLowerCase();
    const items = query
      ? demands.filter((item) => `${item.name} ${item.company || ""} ${item.field || ""}`.toLowerCase().includes(query))
      : demands;
    return items.slice(0, 8);
  }, [demands, demandQuery]);
  const topMatch = matches[0];
  const successIndex = topMatch ? Math.min(96, Math.max(62, Math.round(topMatch.matchScore * 0.82 + 12))) : 0;
  const compactMatchLevel = topMatch
    ? topMatch.matchScore >= 90 ? "卓越" : topMatch.matchScore >= 80 ? "优秀" : topMatch.matchScore >= 70 ? "良好" : "一般"
    : "--";
  const recommendedCases = matches.slice(0, 3);
  const complexity = matchMeta?.complexity || topMatch?.algorithm?.complexity;
  const managers = matchMeta?.managers || [];
  const algorithmFactors = topMatch?.algorithm || {};
  function exportReport() {
    if (!selectedDemand || !topMatch) return;
    setReportPreview(buildTransferReportHtml(selectedDemand, topMatch, complexity, managers));
  }
  function downloadPreviewPdf() {
    const previewFrame = document.getElementById("transfer-report-preview-frame");
    if (!previewFrame?.contentWindow) return;
    previewFrame.contentWindow.focus();
    previewFrame.contentWindow.print();
  }
  return React.createElement("div", { className: "layout-two match-workspace" },
    React.createElement("section", { className: "panel match-page-panel" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null, React.createElement("h2", null, "推荐专家"), React.createElement("span", { className: "eyebrow" }, "AI EXPERT MATCHING")),
        React.createElement("div", { className: "demand-search-selector" },
          React.createElement("input", {
            value: demandQuery,
            onChange: (event) => { setDemandQuery(event.target.value); setShowDemandResults(true); },
            onFocus: () => setShowDemandResults(true),
            onBlur: () => window.setTimeout(() => setShowDemandResults(false), 120),
            placeholder: "搜索需求名称、企业或领域",
            "aria-label": "搜索并选择需求"
          }),
          showDemandResults && React.createElement("div", { className: "demand-search-results" },
            filteredDemandOptions.length
              ? filteredDemandOptions.map((item) => React.createElement("button", {
                type: "button",
                className: Number(item.id) === Number(selectedDemand?.id) ? "active" : "",
                key: item.id,
                onMouseDown: (event) => event.preventDefault(),
                onClick: () => { setDemandQuery(item.name); setShowDemandResults(false); onSelect(item.id); }
              },
                React.createElement("b", null, item.name),
                React.createElement("span", null, [item.company, item.field].filter(Boolean).join(" · "))
              ))
              : React.createElement("p", null, "没有找到相关需求")
          )
        )
      ),
      React.createElement("div", { className: "match-command-deck" },
        React.createElement("div", { className: "command-main" },
          React.createElement("span", { className: "eyebrow" }, "AI MATCH COMMAND"),
          React.createElement("h2", null, selectedDemand ? selectedDemand.name : "选择需求生成匹配指挥台"),
          React.createElement("div", { className: "command-kpis" },
            [
              ["候选专家", matches.length || "--"],
              ["首选匹配", topMatch ? `${topMatch.matchScore}%` : "--"],
              ["匹配等级", compactMatchLevel],
              ["成功指数", topMatch ? `${successIndex}%` : "--"],
              ["复杂度", complexity ? `${complexity.complexityScore}/100` : "--"]
            ].map((item) => React.createElement("article", { key: item[0] }, React.createElement("span", null, item[0]), React.createElement("b", null, item[1])))
          )
        ),
        React.createElement("div", { className: "command-radar" },
          ["需求", "成果", "专家", "经理人", "政策", "资金"].map((item, index) => React.createElement("span", { className: `cr${index + 1}`, key: item }, item)),
          React.createElement("strong", null, topMatch ? `${topMatch.matchScore}%` : "AI")
        )
      ),
      topMatch && React.createElement("div", { className: "live-consent-banner" },
        React.createElement("div", null,
          React.createElement("b", null, "现场推荐已生成"),
          React.createElement("p", null, `科小企建议优先对接 ${topMatch.name}。授权后，科小专会代表专家侧确认可沟通范围，并建立一对一磋商室。`)
        ),
        React.createElement("button", { className: "primary", onClick: () => onStart(topMatch) }, "授权首选推荐")
      ),
      complexity && React.createElement("div", { className: "algorithm-route-card" },
        React.createElement("b", null, complexity.routeLabel),
        React.createElement("span", null, `需求复杂度 ${complexity.complexityScore}/100 · ${complexity.complexityLevel === "complex" ? "疑难复杂" : complexity.complexityLevel === "medium" ? "中等复杂" : "简单明确"}`),
        React.createElement("p", null, complexity.reasons.join("；")),
        managers.length > 0 && React.createElement("div", { className: "manager-mini-list" },
          managers.map((manager) => React.createElement("span", { key: manager.id }, `推荐经理人：${manager.name} ${manager.recommendScore || manager.responseRate}%`))
        )
      ),
      recommendedCases.length > 0 && React.createElement("div", { className: "case-recommend-strip" },
        recommendedCases.map((expert, index) =>
          React.createElement("div", { className: index === 0 ? "case-chip best" : "case-chip", key: expert.id },
            React.createElement("span", null, `案例${index + 1}`),
            React.createElement("b", null, `${selectedDemand?.name || "现场需求"} × ${expert.name}`),
            React.createElement("em", null, `${expert.matchScore}%`)
          )
        )
      ),
      topMatch && React.createElement("div", { className: "match-insight-grid" },
        React.createElement("section", { className: "insight-card factor-card" },
          React.createElement("h3", null, "算法因子"),
          [
            ["关键词", algorithmFactors.keyword ?? 72],
            ["语义", algorithmFactors.semantic ?? 68],
            ["领域", algorithmFactors.field ?? 88],
            ["指标", algorithmFactors.technical ?? 74],
            ["区域", algorithmFactors.region ?? 86],
            ["成熟度", algorithmFactors.maturity ?? 82],
            ["需求真实性", algorithmFactors.authenticity ?? selectedDemand?.authenticity?.score ?? 76]
          ].map((item) => React.createElement("div", { className: "factor-row", key: item[0] },
            React.createElement("span", null, item[0]),
            React.createElement("i", null, React.createElement("b", { style: { width: `${item[1]}%` } })),
            React.createElement("em", null, `${item[1]}%`)
          ))
        ),
        React.createElement("section", { className: "insight-card policy-card" },
          React.createElement("h3", null, "政策/资金建议"),
          ["揭榜挂帅", "首台套/首批次", "科技成果转化奖补", "专精特新培育", "科技金融"].map((item) =>
            React.createElement("span", { key: item }, item)
          )
        ),
        React.createElement("section", { className: "insight-card risk-card" },
          React.createElement("h3", null, "风险预警"),
          [
            ["需求真实性", selectedDemand?.authenticity?.score || 76],
            ["知识产权", complexity?.reasons?.join("").includes("知识产权") ? 62 : 84],
            ["量产交付", complexity?.reasons?.join("").includes("量产") ? 58 : 80]
          ].map((item) => React.createElement("div", { className: item[1] < 70 ? "risk-line warn" : "risk-line", key: item[0] },
            React.createElement("b", null, item[0]),
            React.createElement("span", null, `${item[1]}分`)
          ))
        )
      ),
      matches.length > 0 && React.createElement("div", { className: "expert-matrix" },
        React.createElement("div", { className: "matrix-head" },
          ["候选对象", "匹配", "等级", "语义/指标", "建议动作"].map((item) => React.createElement("b", { key: item }, item))
        ),
        matches.slice(0, 5).map((expert, index) => React.createElement("div", { className: index === 0 ? "matrix-row best" : "matrix-row", key: expert.id },
          React.createElement("button", { className: "link-button expert-name-link", onClick: () => setActiveExpert(expert), title: "查看专家画像" }, expert.name),
          React.createElement("strong", null, `${expert.matchScore}%`),
          React.createElement("span", { className: `match-tier ${expert.matchClass || ""}` }, expert.matchLevel || "待判断"),
          React.createElement("span", null, `${expert.algorithm?.semantic ?? "--"}% / ${expert.algorithm?.technical ?? "--"}%`),
          React.createElement("em", null, expert.managerRecommended ? "派经理人" : expert.matchScore < 60 ? "不推荐" : index === 0 ? "优先磋商" : "备选邀约")
        ))
      ),
      React.createElement("div", { className: "list" }, matches.map((expert) =>
        React.createElement("article", { className: "card", key: expert.id },
          React.createElement("div", { className: "match-row" },
            React.createElement("div", null,
              React.createElement("h3", null,
                React.createElement("button", { className: "link-button expert-title-link", onClick: () => setActiveExpert(expert), title: "查看专家画像" }, expert.name)
              ),
              React.createElement("div", { className: "meta" },
                React.createElement("span", { className: "tag" }, expert.title),
                React.createElement("span", { className: "tag" }, expert.field),
                React.createElement("span", { className: "tag accent" }, expert.region),
                React.createElement("span", { className: `tag match-tier ${expert.matchClass || ""}` }, expert.matchLevel || expert.matchLabel || "待判断"),
                expert.managerRecommended && React.createElement("span", { className: "tag accent" }, "建议技术经理人介入")
              ),
              React.createElement("p", null, expert.organization),
              React.createElement("p", null, expert.reason),
              React.createElement("div", { className: "match-advice" },
                React.createElement("b", null, `成功指数 ${Math.min(96, Math.max(62, Math.round(expert.matchScore * 0.82 + 12)))}%`),
                React.createElement("span", null, expert.matchScore < 60 ? "匹配低于60分，不建议直接进入磋商，可先补充需求或更换专家。" : expert.managerRecommended ? "匹配度较高但项目复杂，建议先派技术经理人组织需求复核、报价边界和专家磋商。" : "需求边界较清晰，可直接完成NDA、指标复核和专家预沟通。")
              ),
              React.createElement("div", { className: "dual-consent" },
                React.createElement("span", { className: "done" }, "企业授权"),
                React.createElement("span", null, "专家智能体确认"),
                React.createElement("span", null, "进入磋商")
              )
            ),
            React.createElement("div", { className: "score" }, `${expert.matchScore}%`)
          ),
          React.createElement("button", { className: "secondary", onClick: () => onStart(expert) }, "授权该推荐并发起确认")
        )
      ))
    ),
    React.createElement("aside", { className: "panel match-ai-cockpit" },
      React.createElement("div", { className: "cockpit-glow" }),
      React.createElement("div", { className: "cockpit-head" },
        React.createElement("span", { className: "eyebrow" }, "AI Matching Engine"),
        React.createElement("h2", null, "智能撮合驾驶舱"),
        React.createElement("p", null, selectedDemand ? selectedDemand.name : "选择需求后生成技术流匹配画像")
      ),
      topMatch && React.createElement("div", { className: "report-export-card" },
        React.createElement("b", null, "转化撮合报告"),
        React.createElement("p", null, "先预览完整报告和排版，确认无误后再保存为 PDF。"),
        React.createElement("button", { className: "primary", onClick: exportReport }, "预览并导出PDF")
      ),
      React.createElement("div", { className: "cockpit-score" },
        React.createElement("div", { className: "score-orbit" },
          React.createElement("strong", null, topMatch ? `${topMatch.matchScore}%` : "--"),
          React.createElement("span", null, "综合匹配")
        ),
        React.createElement("div", null,
          React.createElement("b", null, topMatch ? topMatch.name : "等待需求画像"),
          React.createElement("small", null, topMatch ? `${topMatch.field} · ${topMatch.region} · 成功指数 ${successIndex}%` : "系统将从成果库、专家库、经理人库同步推理")
        )
      ),
      React.createElement("div", { className: "match-process-board" },
        ["读取需求文本", "抽取指标与预算", "召回成果/专家", "计算匹配指数", "评估成功指数", "生成转化建议"].map((step, index) =>
          React.createElement("span", { className: index < (topMatch ? 6 : 2) ? "done" : "", key: step }, step)
        )
      ),
      React.createElement("div", { className: "ai-flow-map" },
        ["需求语义", "领域向量", "专家画像", "经理人撮合", "政策基金"].map((item, index) =>
          React.createElement("div", { className: "flow-node", key: item },
            React.createElement("i", null, `0${index + 1}`),
            React.createElement("span", null, item)
          )
        )
      ),
      React.createElement("div", { className: "signal-stack" },
        aiSignal("技术指标", topMatch ? 98 : 0),
        aiSignal("产业经验", topMatch ? 92 : 0),
        aiSignal("区域协同", topMatch ? 88 : 0),
        aiSignal("转化活跃", topMatch ? 95 : 0)
      ),
      React.createElement("div", { className: "tech-route-board" },
        React.createElement("h3", null, "撮合路线"),
        ["需求复核", "NDA", "样件/数据", "技术验证", "合同要点", "政策资金"].map((item, index) =>
          React.createElement("span", { className: index < 3 ? "done" : "", key: item }, item)
        )
      ),
      React.createElement("div", { className: "mini-network" },
        React.createElement("strong", null, "协同网络"),
        ["企业", "科小企", "专家", "科小专", "科小经"].map((item, index) => React.createElement("i", { className: `mn${index + 1}`, key: item }, item))
      ),
      React.createElement("div", { className: "push-window" },
        React.createElement("h3", null, "实时推送"),
        [
          topMatch ? `已锁定${topMatch.name}，建议优先发起智能体预沟通。` : "等待推荐专家。",
          selectedDemand ? "科小果已生成企业访谈提纲、指标确认表和NDA清单。" : "选择需求后生成材料清单。",
          "技术经理人将收到撮合任务：需求复核、专家邀约、样件验证、合同推进。"
        ].map((item, index) => React.createElement("div", { className: "push-item", key: item },
          React.createElement("time", null, `T+0${index}`),
          React.createElement("span", null, item)
        ))
      ),
      React.createElement("button", { className: "primary cockpit-action", disabled: !topMatch, onClick: () => topMatch && onStart(topMatch) }, "启动AI预沟通")
    ),
    reportPreview && React.createElement("div", { className: "modal-backdrop report-preview-backdrop" },
      React.createElement("section", { className: "report-preview-modal", role: "dialog", "aria-modal": "true", "aria-label": "转化撮合报告预览" },
        React.createElement("div", { className: "report-preview-toolbar" },
          React.createElement("div", null,
            React.createElement("h2", null, "转化撮合报告预览"),
            React.createElement("p", null, "请先检查报告内容和排版，确认后点击“下载 PDF”。")
          ),
          React.createElement("div", { className: "report-preview-actions" },
            React.createElement("button", { className: "ghost", onClick: () => setReportPreview("") }, "关闭预览"),
            React.createElement("button", { className: "primary", onClick: downloadPreviewPdf }, "下载 PDF")
          )
        ),
        React.createElement("iframe", {
          id: "transfer-report-preview-frame",
          className: "report-preview-frame",
          title: "转化撮合报告内容",
          srcDoc: reportPreview
        })
      )
    ),
    activeExpert && React.createElement(ExpertProfileModal, { expert: activeExpert, onClose: () => setActiveExpert(null) })
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTransferReportHtml(demand, expert, complexity, managers) {
  const managerText = managers?.length ? managers.map((item) => `${item.name}（${item.recommendScore || item.responseRate}%）`).join("、") : "该需求边界较清晰，可先由双方智能体预沟通";
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  const reportNo = `豫科转智报〔${new Date().getFullYear()}〕${String(demand.id || 1).padStart(3, "0")}号`;
  const route = complexity?.routeLabel || expert.recommendationRouteLabel || "可直接推荐专家/成果";
  const reasons = complexity?.reasons?.join("；") || "需求画像较完整，建议先进入预沟通";
  const budget = demand.budgetText || demand.budgetAmount || "未说明";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>转化撮合报告-${escapeHtml(demand.name || "需求")}</title>
  <style>
    @page { size: A4; margin: 30mm 26mm 26mm 26mm; }
    body {
      margin: 0;
      color: #111;
      background: #f3f4f6;
      font-family: FangSong, STFangsong, "仿宋", "SimSun", "宋体", serif;
      font-size: 16pt;
      line-height: 1.78;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 24mm 24mm 22mm;
      background: #fff;
      box-shadow: 0 10px 40px rgba(0,0,0,.12);
    }
    .doc-mark {
      text-align: center;
      color: #c00000;
      font-family: SimHei, "黑体", sans-serif;
      font-size: 18pt;
      letter-spacing: 2pt;
      border-bottom: 2px solid #c00000;
      padding-bottom: 8mm;
      margin-bottom: 12mm;
    }
    h1 {
      margin: 0 0 10mm;
      text-align: center;
      font-family: SimHei, "黑体", sans-serif;
      font-size: 24pt;
      line-height: 1.35;
      font-weight: 700;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #999;
      padding-bottom: 4mm;
      margin-bottom: 10mm;
      font-size: 12pt;
      color: #333;
    }
    .recipient {
      margin: 0 0 6mm;
      font-weight: 700;
    }
    h2 {
      margin: 7mm 0 2mm;
      font-family: SimHei, "黑体", sans-serif;
      font-size: 16pt;
    }
    p { margin: 0 0 2mm; text-indent: 2em; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 4mm 0 6mm;
      font-size: 13pt;
      line-height: 1.55;
    }
    th, td {
      border: 1px solid #666;
      padding: 2.5mm 3mm;
      vertical-align: top;
    }
    th {
      width: 28%;
      font-family: SimHei, "黑体", sans-serif;
      background: #f5f5f5;
      text-align: left;
      font-weight: 700;
    }
    .opinion {
      border: 1px solid #999;
      padding: 5mm;
      margin-top: 4mm;
    }
    .signature {
      margin-top: 16mm;
      text-align: right;
      line-height: 2;
    }
    .copy {
      margin-top: 14mm;
      padding-top: 4mm;
      border-top: 1px solid #999;
      font-size: 11pt;
      color: #333;
      text-indent: 0;
    }
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; width: auto; min-height: auto; padding: 0; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="doc-mark">科技成果转化智能服务平台</div>
    <h1>关于“${escapeHtml(demand.name || "企业技术需求")}”<br>供需智能撮合情况的报告</h1>
    <div class="meta"><span>${escapeHtml(reportNo)}</span><span>${escapeHtml(today)}</span></div>
    <p class="recipient">平台管理单位：</p>
    <p>根据企业技术需求登记信息及平台专家成果库、技术经理人库、政策资金库等数据，平台智能体已完成初步画像、智能匹配和转化路径研判。现将有关情况报告如下。</p>

    <h2>一、需求基本情况</h2>
    <table>
      <tr><th>需求名称</th><td>${escapeHtml(demand.name || "未填写")}</td></tr>
      <tr><th>企业主体</th><td>${escapeHtml(demand.company || "未填写")}</td></tr>
      <tr><th>技术领域</th><td>${escapeHtml(demand.field || "未填写")}</td></tr>
      <tr><th>技术指标</th><td>${escapeHtml(demand.technicalIndicators || demand.detail || "未填写")}</td></tr>
      <tr><th>拟解决难题</th><td>${escapeHtml(demand.problem || "未填写")}</td></tr>
      <tr><th>预算及合作方式</th><td>${escapeHtml(budget)}；${escapeHtml(demand.cooperation || "未说明")}</td></tr>
    </table>

    <h2>二、智能匹配结果</h2>
    <table>
      <tr><th>首选专家/成果方</th><td>${escapeHtml(expert.name || "未匹配")}；${escapeHtml(expert.organization || "未填写")}</td></tr>
      <tr><th>综合匹配度</th><td>${escapeHtml(expert.matchScore || "--")}%</td></tr>
      <tr><th>推荐理由</th><td>${escapeHtml(expert.reason || "暂无")}</td></tr>
      <tr><th>复杂度分流</th><td>${escapeHtml(route)}；复杂度评分：${escapeHtml(complexity?.complexityScore ?? "待计算")}/100</td></tr>
      <tr><th>分流依据</th><td>${escapeHtml(reasons)}</td></tr>
      <tr><th>技术经理人建议</th><td>${escapeHtml(managerText)}</td></tr>
    </table>

    <h2>三、风险提示</h2>
    <p>一是需进一步核验企业应用场景、预算边界、验收口径及可开放样件或数据条件。二是需确认专家成果成熟度、知识产权边界、质量责任和交付周期。三是涉及中试、量产、长期供应或合规认证的，建议由技术经理人组织尽调。</p>

    <h2>四、转化路径建议</h2>
    <p>建议按照“需求复核—保密协议—样件/数据交换—技术验证方案—报价与合同边界—政策资金联动—转化落地跟踪”的路径推进。对符合条件的项目，可同步关注揭榜挂帅、首台套/首批次、科技成果转化奖补、高新技术企业培育、专精特新培育、科技金融和产业基金等政策工具。</p>

    <h2>五、办理建议</h2>
    <div class="opinion">
      <p>建议同意将该需求纳入平台重点撮合线索，由平台智能体继续跟踪双方预沟通记录，并视项目复杂度派发技术经理人开展需求复核、专家邀约、样件验证和合作协议要点梳理。</p>
    </div>

    <div class="signature">
      <div>科技成果转化智能服务平台</div>
      <div>${escapeHtml(today)}</div>
    </div>
    <p class="copy">抄送：企业服务专员、技术经理人、相关专家团队。本文为平台智能辅助生成材料，正式报送前应结合人工复核意见完善。</p>
  </main>
</body>
</html>`;
}

function aiSignal(label, value) {
  return React.createElement("div", { className: "ai-signal" },
    React.createElement("div", null, React.createElement("span", null, label), React.createElement("b", null, `${value}%`)),
    React.createElement("i", null, React.createElement("em", { style: { width: `${value}%` } }))
  );
}

function textHasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function simpleMoney(value) {
  const text = String(value || "").replace(/,/g, "");
  if (!text || /面议|未说明|无/.test(text)) return 0;
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return 0;
  let amount = Number(match[1]);
  if (text.includes("亿")) amount *= 100000000;
  if (text.includes("万")) amount *= 10000;
  return amount;
}

function evaluateDemandDraft(form) {
  const platformWords = ["交易市场", "科技创新中心", "情报研究所", "代理企业", "服务中心", "产业园", "发展中心", "运营公司", "协会", "平台"];
  const industryWords = ["新材料", "人工智能", "现代农业", "生物医药", "电子信息", "新能源", "节能环保", "高端装备", "智能制造", "食品", "化工", "医疗器械", "无人机", "机器人", "传感器", "储能", "种业", "大棚", "铝合金", "腐蚀", "焊接", "产线", "工艺", "材料", "装备"];
  const quantWords = ["≥", "≤", "%", "MPa", "GPa", "km", "kg", "nm", "微米", "小时", "秒", "吨", "万元", "准确率", "良率", "成本", "半径", "载重", "ppm", "kWh", "℃"];
  const foundationWords = ["产线", "车间", "设备", "实验室", "样品", "样件", "试点", "中试", "客户", "团队", "数据", "台架", "平台", "专利", "订单", "批量", "供应商"];
  const scenarioWords = ["生产", "应用", "场景", "工艺", "产品", "产线", "试点", "客户", "运营", "示范", "交付", "产业化", "采购", "验证", "验收", "质量", "供应链"];
  const vague = /未说明|面议|其他|暂无|无。?$|待定|不详|技术指标面议|根据需要|看情况|越高越好|越低越好|尽快|先进水平/;
  const contradictionPairs = [
    [/预算.{0,8}(0|无|没有|不投入)/, /预算|万元|采购|联合开发/],
    [/无基础|没有基础|暂无基础/, /产线|设备|实验室|中试|客户|订单|数据/],
    [/无指标|指标待定|技术指标面议/, /≥|≤|准确率|良率|强度|小时|吨|%/],
    [/仅咨询|了解一下/, /采购|长期供应|联合开发|预算|样件/]
  ];
  const risks = [];

  const name = String(form.name || "");
  const company = String(form.company || "");
  const field = String(form.field || "");
  const keywords = String(form.keywords || "");
  const detail = String(form.detail || "");
  const indicators = String(form.technicalIndicators || "");
  const problem = String(form.problem || "");
  const foundation = String(form.foundation || "");
  const allText = [name, company, field, keywords, detail, indicators, problem, foundation, form.cooperation, form.orgType, form.region, form.source].join("");
  const budgetAmount = simpleMoney(form.budgetText || form.budgetAmount || form.budget);

  let problemClarity = 0;
  const textLength = [name, detail, problem, foundation, indicators].join("").replace(/\s+/g, "").length;
  if (textLength >= 220) problemClarity += 5;
  else if (textLength >= 150) problemClarity += 4;
  else if (textLength >= 90) problemClarity += 3;
  else if (textLength >= 50) problemClarity += 2;
  if (name.length >= 8 && !vague.test(name)) problemClarity += 2;
  if (detail.length >= 40 && !vague.test(detail)) problemClarity += 3;
  if (problem.length >= 25 && !vague.test(problem)) problemClarity += 4;
  if (/痛点|瓶颈|替代|升级|降本|提质|效率|安全|质量|稳定|可靠|国产化|规模化|注册|量产/.test(`${detail}${problem}`)) problemClarity += 1;
  if (detail.length < 30) risks.push("需求详情字数不足");
  if (problem.length < 15) risks.push("技术难题描述过短");

  let technical = 0;
  const numericCount = (indicators.match(/\d+(?:\.\d+)?|≥|≤|不低于|不高于|以内|以上|以下/g) || []).length;
  if (numericCount >= 3 || textHasAny(indicators, quantWords)) technical += 9;
  else if (numericCount >= 1) technical += 5;
  if (/验收|准确率|良率|成本|寿命|误报率|响应|时间|强度|半径|载重|去除率|回收率|盐雾|焊接|能耗/.test(indicators)) technical += 6;
  if (indicators.length >= 35 && !vague.test(indicators)) technical += 5;
  if (!indicators || vague.test(indicators)) risks.push("技术指标不可验证");

  let industryFit = 0;
  if (field && textHasAny(`${field}${keywords}${name}${detail}`, industryWords)) industryFit += 7;
  if (textHasAny(allText, industryWords)) industryFit += 5;
  if (field && detail && textHasAny(detail, field.split(/[，,、;；\s]/).filter(Boolean))) industryFit += 3;
  if (!field) risks.push("缺少技术领域");

  let enterpriseCredibility = 0;
  if (company && !textHasAny(company, platformWords)) enterpriseCredibility += 6;
  if (/企业|公司|集团|厂|有限|股份/.test(company) || /企业|民营|国有|高新/.test(String(form.orgType || ""))) enterpriseCredibility += 5;
  if (form.contact || /联系人|电话|邮箱|手机/.test(allText)) enterpriseCredibility += 2;
  if (form.region) enterpriseCredibility += 2;
  if (textHasAny(company, platformWords)) risks.push("非企业本体或平台代填");
  if (!company) risks.push("缺少企业主体");

  let implementationReadiness = 0;
  if (textHasAny(detail, scenarioWords) || textHasAny(allText, scenarioWords)) implementationReadiness += 5;
  if (textHasAny(foundation, foundationWords)) implementationReadiness += 5;
  if (budgetAmount > 0) implementationReadiness += 4;
  if (form.cooperation && !vague.test(String(form.cooperation))) implementationReadiness += 3;
  if (form.validUntilText || form.validUntil || form.source) implementationReadiness += 2;
  if (/样件|测试|中试|试点|验证|采购|订单|客户|交付|量产/.test(allText)) implementationReadiness += 1;
  if (!foundation || vague.test(foundation)) risks.push("现有基础不足");
  if (!budgetAmount) risks.push("预算金额未量化");

  let consistencyRisk = 15;
  contradictionPairs.forEach(([negative, positive]) => {
    if (negative.test(allText) && positive.test(allText)) consistencyRisk -= 5;
  });
  if (budgetAmount > 500000000 && !/集团|上市|大型|央企|国企/.test(`${company}${form.orgType || ""}`)) {
    consistencyRisk -= 3;
    risks.push("预算与企业规模疑似不匹配");
  }
  if (consistencyRisk < 15) risks.push("文本存在前后矛盾或口径冲突");

  const dimensions = {
    enterpriseCredibility: Math.min(enterpriseCredibility, 15),
    problemClarity: Math.min(problemClarity, 15),
    technicalVerifiability: Math.min(technical, 20),
    industryFit: Math.min(industryFit, 15),
    implementationReadiness: Math.min(implementationReadiness, 20),
    consistencyRisk: Math.max(0, Math.min(consistencyRisk, 15))
  };
  // 真实性属于风险评估，不给绝对满分；即使字段完整，仍保留人工核验空间。
  const score = Math.min(99, Math.round(Object.values(dimensions).reduce((sum, value) => sum + value, 0)));
  return {
    score,
    level: score >= 80 ? "高可信" : score >= 60 ? "基本可信" : score >= 40 ? "疑似虚假" : "虚假/高风险",
    verdict: score >= 60 ? "真实需求" : "虚假需求",
    recommendation: score >= 80 ? "优先对接" : score >= 60 ? "补充访谈后对接" : score >= 40 ? "人工复核并要求补证" : "判定虚假，暂缓入库",
    riskTags: [...new Set(risks)],
    dimensions
  };
}

function AdminPanel({ refreshDemands }) {
  const adminConfigs = {
    achievements: { title: "成果库", fields: achievementFields, empty: emptyAchievement, nameKey: "name", subKey: "organization", importHint: "成果名称,完成单位,所属高新技术领域,成果简介,成果关键字" },
    demands: { title: "需求库", fields: demandAdminFields, empty: { ...emptyDemand, budgetText: "面议", validUntilText: "长期" }, nameKey: "name", subKey: "company", importHint: "需求名称,所属单位或公司名称,技术领域,技术指标,预算金额" },
    demandReview: { title: "需求管理", fields: [], empty: {}, nameKey: "name", subKey: "company", importHint: "自动读取需求库并生成真实性评分" },
    realDemands: { title: "真实需求", collection: "demands", fields: realDemandFields, empty: { ...emptyDemand, detail: "", technicalIndicators: "", problem: "", foundation: "", budgetText: "100万元", source: "管理员真实需求复核", contact: "", evidence: "" }, nameKey: "name", subKey: "company", importHint: "需求名称,真实需求企业,技术领域,可验收技术指标,预算金额" },
    experts: { title: "专家库", fields: expertFields, empty: emptyExpert, nameKey: "name", subKey: "organization", importHint: "专家名称,所属单位,战略性新兴产业分类,专业特长,所属地域" },
    techManagers: { title: "技术经理人", fields: techManagerFields, empty: {}, nameKey: "name", subKey: "organization", importHint: "经理人名称,服务机构,所属地域,服务产业,服务标签" },
    matches: { title: "供需匹配", fields: matchAdminFields, empty: {}, nameKey: "demandName", subKey: "expertName", importHint: "需求名称,专家/成果方,技术领域,匹配指数,成功指数,匹配理由" },
    agents: { title: "智能体广场", fields: agentAdminFields, empty: {}, nameKey: "name", subKey: "category", importHint: "智能体名称,智能体昵称,智能体类别,能力说明,默认提示词" },
    videos: { title: "演示视频", fields: videoAdminFields, empty: {}, nameKey: "title", subKey: "category", importHint: "视频标题,视频类别,封面说明,视频链接,视频说明" }
  };
  const [tab, setTab] = useState("achievements");
  const [data, setData] = useState({});
  const [forms, setForms] = useState(Object.fromEntries(Object.entries(adminConfigs).map(([key, config]) => [key, { ...config.empty }])));
  const [editingId, setEditingId] = useState(null);
  const [importText, setImportText] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => { loadAdminData(); }, []);

  async function loadAdminData() {
    const result = await api.get("/api/admin/content");
    setData(result);
  }

  function updateForm(type, key, value) {
    setForms((current) => ({ ...current, [type]: { ...current[type], [key]: value } }));
  }

  function resetForm(type) {
    setForms((current) => ({ ...current, [type]: { ...adminConfigs[type].empty } }));
    setEditingId(null);
  }

  async function submitAdmin(type, event) {
    event.preventDefault();
    const collection = adminConfigs[type].collection || type;
    const sourcePatch = type === "realDemands" ? { source: forms[type].source || "管理员真实需求复核" } : {};
    const payload = { ...forms[type], ...sourcePatch, adminRole: "admin" };
    const url = editingId ? `/api/admin/collections/${collection}/${editingId}` : `/api/admin/collections/${collection}`;
    try {
      const result = editingId ? await fetchJson(url, "PUT", payload) : await api.post(url, payload);
      setNotice(`${editingId ? "已更新" : "已新增"}${adminConfigs[type].title}：${result.item?.[adminConfigs[type].nameKey] || payload[adminConfigs[type].nameKey] || "内容"}`);
      resetForm(type);
      await loadAdminData();
      if (collection === "demands") refreshDemands();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function importRows(type) {
    if (!importText.trim()) return setNotice("请先粘贴 CSV、TSV 或从 Excel 复制的表格内容。");
    const collection = adminConfigs[type].collection || type;
    try {
      const result = await api.post(`/api/admin/collections/${collection}/import`, { adminRole: "admin", text: importText });
      setNotice(`已批量导入 ${result.count} 条${adminConfigs[type].title}内容。`);
      setImportText("");
      await loadAdminData();
      if (collection === "demands") refreshDemands();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function deleteItem(type, item) {
    const label = item[adminConfigs[type].nameKey] || "该内容";
    if (!window.confirm(`确认删除“${label}”？`)) return;
    const collection = adminConfigs[type].collection || type;
    try {
      await fetchJson(`/api/admin/collections/${collection}/${item.id}`, "DELETE", { adminRole: "admin" });
      setNotice(`已删除：${label}`);
      await loadAdminData();
      if (collection === "demands") refreshDemands();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function reorderItem(type, item, direction) {
    const collection = adminConfigs[type].collection || type;
    await api.post(`/api/admin/collections/${collection}/reorder`, { adminRole: "admin", id: item.id, direction });
    await loadAdminData();
  }

  const config = adminConfigs[tab];
  const items = tab === "realDemands"
    ? (data.demands || []).filter((item) => item.authenticity || item.source === "管理员真实需求复核")
    : (data[tab] || []);
  const draftAuthenticity = tab === "realDemands" ? evaluateDemandDraft(forms.realDemands || {}) : null;

  return React.createElement("section", { className: "admin-page" },
    React.createElement("div", { className: "admin-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "My Admin Console"),
        React.createElement("h2", null, "我的管理后台"),
        React.createElement("p", null, "集中管理成果库、需求库、专家库、供需匹配、智能体广场、技术经理人和演示视频，支持添加、编辑、删除、排序和表格批量导入。")
      ),
      React.createElement("div", { className: "library-kpis" },
        libraryKpi("成果", (data.achievements || []).length),
        libraryKpi("需求", demoTotals.demands),
        libraryKpi("专家", demoTotals.experts),
        libraryKpi("经理人", demoTotals.techManagers)
      )
    ),
    React.createElement("div", { className: "admin-tabs" },
      Object.entries(adminConfigs).map(([key, item]) =>
        React.createElement("button", { key, className: tab === key ? "active" : "", onClick: () => { setTab(key); resetForm(key); setImportText(""); } }, item.title)
      )
    ),
    notice && React.createElement("div", { className: "admin-notice" }, notice),
    tab === "demandReview" && React.createElement(DemandReviewPanel, { demands: data.demands || [] }),
    tab !== "demandReview" && 
    React.createElement("div", { className: "admin-layout admin-layout-wide" },
      React.createElement("section", { className: "panel admin-form-panel" },
        React.createElement("div", { className: "panel-header" },
          React.createElement("div", null,
            React.createElement("h2", null, `${config.title}内容维护`),
            React.createElement("span", { className: "eyebrow" }, editingId ? "正在编辑已有内容" : "新增内容会立即进入前台展示或匹配流程")
          ),
          editingId && React.createElement("button", { type: "button", className: "ghost", onClick: () => resetForm(tab) }, "取消编辑")
        ),
        React.createElement("form", { className: "form-grid admin-form-grid", onSubmit: (event) => submitAdmin(tab, event) },
          config.fields.map((item) => adminField(item, forms[tab][item[0]] || "", (value) => updateForm(tab, item[0], value))),
          tab === "realDemands" && React.createElement(AuthenticityPreview, { result: draftAuthenticity }),
          React.createElement("div", { className: "wide admin-form-actions" },
            React.createElement("button", { className: "primary" }, editingId ? "保存修改" : "添加内容"),
            React.createElement("button", { type: "button", className: "ghost", onClick: () => resetForm(tab) }, "清空")
          )
        ),
        React.createElement("div", { className: "bulk-import" },
          React.createElement("div", { className: "panel-header" },
            React.createElement("div", null,
              React.createElement("h3", null, "表格批量导入"),
              React.createElement("span", { className: "eyebrow" }, `表头示例：${config.importHint}`)
            ),
            React.createElement("button", { className: "secondary", type: "button", onClick: () => importRows(tab) }, "自动导入")
          ),
          React.createElement("textarea", { value: importText, onChange: (event) => setImportText(event.target.value), placeholder: `可直接从 Excel 复制粘贴，也可粘贴 CSV/TSV。\n${config.importHint}\n示例名称,示例单位,新材料,示例说明,关键词` })
        )
      ),
      React.createElement("aside", { className: "panel admin-list-panel" },
        React.createElement("div", { className: "panel-header" },
          React.createElement("div", null, React.createElement("h2", null, `${config.title}列表`), React.createElement("span", { className: "eyebrow" }, `共 ${items.length} 条，可排序、编辑、删除`))
        ),
        React.createElement("div", { className: "admin-mini-list admin-manage-list" },
          items.map((item, index) => React.createElement("article", { key: `${tab}-${item.id}` },
            React.createElement("b", null, item[config.nameKey] || "未命名"),
            React.createElement("span", null, item[config.subKey] || item.field || item.category || "未填写"),
            tab === "realDemands" && item.authenticity && React.createElement("div", { className: "authenticity-mini" },
              React.createElement("strong", null, `${item.authenticity.score}分`),
              React.createElement("span", null, item.authenticity.level),
              React.createElement("em", null, item.authenticity.recommendation)
            ),
            React.createElement("small", null, item.reason || item.desc || item.summary || item.problem || item.focus || ""),
            React.createElement("div", null,
              React.createElement("button", { className: "ghost", onClick: () => reorderItem(tab, item, "up"), disabled: index === 0 }, "上移"),
              React.createElement("button", { className: "ghost", onClick: () => reorderItem(tab, item, "down"), disabled: index === items.length - 1 }, "下移"),
              React.createElement("button", { className: "secondary", onClick: () => { setForms((current) => ({ ...current, [tab]: { ...item } })); setEditingId(item.id); } }, "编辑"),
              React.createElement("button", { className: "ghost danger", onClick: () => deleteItem(tab, item) }, "删除")
            )
          ))
        )
      )
    )
  );
}

function DemandReviewPanel({ demands }) {
  const [filter, setFilter] = useState("all");
  const sorted = demands
    .map((item) => ({ ...item, auth: evaluateDemandDraft(item) }))
    .sort((a, b) => (b.auth?.score || 0) - (a.auth?.score || 0));
  const visible = sorted.filter((item) => {
    const score = item.auth?.score || 0;
    if (filter === "fake") return score < 60;
    if (filter === "real") return score >= 60;
    if (filter === "high") return score >= 80;
    return true;
  });
  const realCount = sorted.filter((item) => (item.auth?.score || 0) >= 60).length;
  const fakeCount = sorted.length - realCount;
  const avg = sorted.length ? Math.round(sorted.reduce((sum, item) => sum + (item.auth?.score || 0), 0) / sorted.length) : 0;
  return React.createElement("section", { className: "demand-review-page" },
    React.createElement("div", { className: "review-summary-grid" },
      libraryKpi("平均真实性", `${avg}分`),
      libraryKpi("真实需求", realCount),
      libraryKpi("虚假/待补证", fakeCount),
      libraryKpi("低于60分", sorted.filter((item) => (item.auth?.score || 0) < 60).length)
    ),
    React.createElement("div", { className: "panel demand-review-toolbar" },
      React.createElement("div", null,
        React.createElement("h2", null, "企业需求真实性管理"),
        React.createElement("p", null, "系统按企业主体可信度、需求问题明确度、技术指标可验证性、产业/主营相关性、实施基础与转化可行性、逻辑一致性与风险六个维度打分。评分最高99分，保留人工核验空间；低于60分判定为虚假需求或高风险需求。")
      ),
      React.createElement("div", { className: "review-filter" },
        [["all", "全部"], ["fake", "低于60分"], ["real", "真实需求"], ["high", "高可信"]].map(([key, label]) =>
          React.createElement("button", { className: filter === key ? "active" : "", onClick: () => setFilter(key), key }, label)
        )
      )
    ),
    React.createElement("div", { className: "demand-review-list" },
      visible.map((item) => React.createElement(DemandReviewCard, { demand: item, key: item.id }))
    )
  );
}

function DemandReviewCard({ demand }) {
  const auth = demand.auth || demand.authenticity || evaluateDemandDraft(demand);
  const labels = {
    enterpriseCredibility: "主体可信",
    problemClarity: "问题明确",
    technicalVerifiability: "指标可验",
    industryFit: "产业相关",
    implementationReadiness: "实施可行",
    consistencyRisk: "逻辑一致"
  };
  const max = {
    enterpriseCredibility: 15,
    problemClarity: 15,
    technicalVerifiability: 20,
    industryFit: 15,
    implementationReadiness: 20,
    consistencyRisk: 15
  };
  const dimensions = auth.dimensions || {};
  return React.createElement("article", { className: `demand-review-card ${auth.score < 60 ? "risk" : auth.score >= 80 ? "strong" : ""}` },
    React.createElement("div", { className: "review-score-box" },
      React.createElement("strong", null, auth.score),
      React.createElement("span", null, auth.score >= 60 ? "真实需求" : "虚假需求")
    ),
    React.createElement("div", { className: "review-main" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null,
          React.createElement("h3", null, demand.name || "未命名需求"),
          React.createElement("span", { className: "eyebrow" }, `${demand.company || "未填写企业"}｜${demand.field || "未填写领域"}｜${demand.region || "未填写地区"}`)
        ),
        React.createElement("b", { className: auth.score < 60 ? "review-verdict fake" : "review-verdict" }, `${auth.level} · ${auth.recommendation}`)
      ),
      React.createElement("p", null, demand.problem || demand.detail || "暂无需求详情"),
      React.createElement("div", { className: "review-dimensions" },
        Object.entries(labels).map(([key, label]) => {
          const value = Number(dimensions[key] || 0);
          const percent = Math.round(value / max[key] * 100);
          return React.createElement("div", { className: "review-dimension", key },
            React.createElement("span", null, `${label} ${value}/${max[key]}`),
            React.createElement("i", null, React.createElement("em", { style: { width: `${percent}%` } }))
          );
        })
      ),
      React.createElement("div", { className: "auth-tag-row" },
        (auth.riskTags?.length ? auth.riskTags : ["暂无明显风险"]).slice(0, 6).map((tag) => React.createElement("span", { className: tag === "暂无明显风险" ? "tag" : "tag accent", key: tag }, tag))
      )
    )
  );
}

function AuthenticityPreview({ result }) {
  const tags = result.riskTags?.length ? result.riskTags : ["暂无明显风险"];
  const ringStyle = { "--score": `${result.score}%` };
  return React.createElement("div", { className: "wide authenticity-preview" },
    React.createElement("div", { className: "auth-score-ring", style: ringStyle },
      React.createElement("strong", null, result.score),
      React.createElement("span", null, "真实性评分")
    ),
    React.createElement("div", null,
      React.createElement("b", null, `${result.verdict || (result.score >= 60 ? "真实需求" : "虚假需求")}｜${result.level}｜${result.recommendation}`),
      React.createElement("p", null, "评分会结合企业主体可信度、需求问题明确度、技术指标可验证性、产业/主营相关性、实施基础与转化可行性、逻辑一致性与风险六个维度。保存后由后端重新计算并写入需求记录。"),
      React.createElement("div", { className: "auth-tag-row" },
        tags.map((tag) => React.createElement("span", { className: tag === "暂无明显风险" ? "tag" : "tag accent", key: tag }, tag))
      )
    )
  );
}

async function fetchJson(url, method, data) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "请求失败");
  return json;
}

function adminField(config, value, onChange) {
  const [key, label, type, required] = config;
  const control = type === "textarea"
    ? React.createElement("textarea", { required: Boolean(required), value, onChange: (e) => onChange(e.target.value) })
    : React.createElement("input", { required: Boolean(required), value, onChange: (e) => onChange(e.target.value) });
  return field(label, control, type === "textarea" ? "wide" : "");
}

function Achievements({ initialQuery = "" }) {
  const [items, setItems] = useState([]);
  const [fields, setFields] = useState([]);
  const [q, setQ] = useState(initialQuery);
  const [fieldValue, setFieldValue] = useState("");
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const timer = window.setTimeout(() => load(q, fieldValue), 280);
    return () => window.clearTimeout(timer);
  }, [q, fieldValue]);
  async function load(searchQuery = q, searchField = fieldValue) {
    const result = await api.get(`/api/achievements?q=${encodeURIComponent(searchQuery)}&field=${encodeURIComponent(searchField)}`);
    setItems(result.achievements);
    if (!searchQuery && !searchField) {
      setFields([...new Set(result.achievements.map((item) => item.field).filter(Boolean))]);
    }
    setPage(1);
  }
  return React.createElement("section", { className: "panel" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null, React.createElement("h2", null, "成果浏览与筛选"), React.createElement("span", { className: "eyebrow" }, "按关键词和高新技术领域检索"))
    ),
    React.createElement("form", { className: "filters", onSubmit: (event) => { event.preventDefault(); load(); } },
      React.createElement("input", { placeholder: "搜索成果名称、简介或关键字", value: q, onChange: (e) => setQ(e.target.value) }),
      React.createElement("select", { value: fieldValue, onChange: (e) => setFieldValue(e.target.value) },
        React.createElement("option", { value: "" }, "全部领域"),
        fields.map((item) => React.createElement("option", { key: item }, item))
      ),
      (q || fieldValue) && React.createElement("button", { type: "button", className: "ghost", onClick: () => { setQ(""); setFieldValue(""); load("", ""); } }, "清空"),
      React.createElement("button", { className: "primary" }, "搜索")
    ),
    React.createElement("div", { className: "result-hint" },
      `共检索到 ${items.length} 条成果，每页展示 ${pageSize} 条。可输入关键词或选择领域进一步缩小范围。`
    ),
    React.createElement("div", { className: "catalog-grid achievement-grid" }, visibleItems.map((item) =>
      React.createElement("article", { className: "card", key: item.id },
        React.createElement("div", { className: "achievement-cover" }, "技术成果"),
        React.createElement(AiScoreBadge, { score: evaluateAchievement(item).score, label: "AI转化评分" }),
        React.createElement("h3", null, item.name),
        React.createElement("p", { className: "achievement-summary" }, item.summary),
        React.createElement("div", { className: "meta" },
          React.createElement("span", { className: "tag" }, item.organization),
          React.createElement("span", { className: "tag" }, item.field),
          item.transferMode && item.transferMode !== "其他"
            ? React.createElement("span", { className: "tag accent" }, item.transferMode)
            : null
        ),
        React.createElement("p", { className: "achievement-facts" }, `阶段：${item.stage}；技术水平：${item.level}；联系人：${item.contact}`),
        React.createElement("div", { className: "ai-reason-line" }, evaluateAchievement(item).reason),
        React.createElement("button", { className: "secondary", onClick: () => setActive(item) }, "查看详情")
      )
    )),
    React.createElement(Pagination, { page: currentPage, totalPages, total: items.length, pageSize, onPageChange: setPage }),
    active && React.createElement(AchievementDetailModal, { item: active, onClose: () => setActive(null) })
  );
}

function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (!total) return null;
  const pageNumbers = [];
  let previousPage = 0;
  for (let current = 1; current <= totalPages; current += 1) {
    if (current === 1 || current === totalPages || Math.abs(current - page) <= 2) {
      if (previousPage && current - previousPage > 1) pageNumbers.push(`gap-${previousPage}`);
      pageNumbers.push(current);
      previousPage = current;
    }
  }
  return React.createElement("nav", { className: "pagination-bar", "aria-label": "分页导航" },
    React.createElement("span", { className: "pagination-summary" }, `第 ${page} / ${totalPages} 页 · 每页 ${pageSize} 条 · 共 ${total} 条`),
    React.createElement("div", { className: "pagination-controls" },
      React.createElement("button", { type: "button", className: "pagination-nav", disabled: page <= 1, onClick: () => onPageChange(page - 1) }, "上一页"),
      pageNumbers.map((item) => typeof item === "number"
        ? React.createElement("button", { type: "button", className: item === page ? "pagination-page active" : "pagination-page", key: item, onClick: () => onPageChange(item), "aria-current": item === page ? "page" : undefined }, item)
        : React.createElement("span", { className: "pagination-gap", key: item }, "…")
      ),
      React.createElement("button", { type: "button", className: "pagination-nav", disabled: page >= totalPages, onClick: () => onPageChange(page + 1) }, "下一页")
    )
  );
}

function evaluateAchievement(item) {
  const text = `${item.name} ${item.summary} ${item.stage} ${item.level} ${item.keywords} ${item.transferMode}`;
  let score = 48;
  if (/中试|产业化|示范|应用|样件|量产/.test(text)) score += 18;
  if (/专利|知识产权|授权|论文|标准/.test(text)) score += 12;
  if (/新材料|智能制造|人工智能|生物医药|现代农业|新能源/.test(text)) score += 10;
  if (/许可|转让|联合开发|作价入股|合作/.test(text)) score += 8;
  score = Math.min(96, score);
  const mode = score >= 82 ? "优先进入企业匹配" : score >= 68 ? "建议补充样件/专利后推荐" : "建议技术经理人先做成果画像";
  return { score, reason: `${mode}｜成熟度、市场价值、产业匹配度、知识产权支撑和转化风险综合评估` };
}

function AiScoreBadge({ score, label }) {
  return React.createElement("div", { className: "ai-score-badge", style: { "--score": `${score}%` } },
    React.createElement("strong", null, score),
    React.createElement("span", null, label)
  );
}

function AchievementDetailModal({ item, onClose }) {
  const [notice, setNotice] = useState("");
  const rows = [
    ["技术领域", item.field],
    ["成果形式", item.form],
    ["成果技术水平", item.level],
    ["完成人", item.completer],
    ["所属地区", item.organization.includes("") ? "国内" : "长三角"],
    ["合作方式", item.transferMode === "其他" ? "" : item.transferMode],
    ["项目阶段", item.stage]
  ].filter((row) => row[1]);
  return React.createElement("div", { className: "modal-backdrop" },
    React.createElement("section", { className: "detail-modal" },
      React.createElement("button", { className: "modal-close", onClick: onClose }, "×"),
      React.createElement("div", { className: "detail-head" },
        React.createElement("div", { className: "detail-cover" }, "技术成果"),
        React.createElement("div", null,
          React.createElement("h2", null, item.name),
          React.createElement("p", null, `所属单位或公司名称：${item.organization}`),
          React.createElement("div", { className: "detail-grid" }, rows.map((row) =>
            React.createElement("div", { key: row[0] }, React.createElement("b", null, row[0]), React.createElement("span", null, row[1] || "未评价"))
          ))
        ),
        React.createElement("aside", { className: "detail-actions" },
          React.createElement("button", { className: "accent-btn", onClick: () => setNotice("已收藏该成果，后续可在对接动态中继续跟踪。") }, "收藏"),
          React.createElement("button", { className: "primary", onClick: () => setNotice("已提交对接意向，科小果将生成企业访谈提纲和专家邀约材料。") }, "我要对接"),
          notice && React.createElement("p", { className: "inline-notice" }, notice),
          React.createElement("span", null, "形式审查结果：★★★★★"),
          React.createElement("div", { className: "radar" },
            React.createElement("i", null),
            React.createElement("b", null, "成熟度"),
            React.createElement("em", null, "先进性"),
            React.createElement("strong", null, "创新性")
          )
        )
      ),
      React.createElement("div", { className: "detail-tabs" },
        React.createElement("b", null, "成果详情"),
        React.createElement("span", null, "咨询评估"),
        React.createElement("span", null, "对接动态")
      ),
      React.createElement("section", { className: "detail-section" },
        React.createElement("h3", null, "基本信息"),
        React.createElement("dl", null,
          React.createElement("dt", null, "成果名称"), React.createElement("dd", null, item.name),
          React.createElement("dt", null, "完成人"), React.createElement("dd", null, item.completer),
          React.createElement("dt", null, "完成单位"), React.createElement("dd", null, item.organization),
          React.createElement("dt", null, "成果简介"), React.createElement("dd", null, item.summary)
        )
      ),
      React.createElement("section", { className: "detail-section" },
        React.createElement("h3", null, "成果属性"),
        React.createElement("dl", null,
          React.createElement("dt", null, "所属高新技术领域"), React.createElement("dd", null, item.field),
          React.createElement("dt", null, "成果体现形式"), React.createElement("dd", null, item.form),
          React.createElement("dt", null, "成果所处阶段"), React.createElement("dd", null, item.stage),
          React.createElement("dt", null, "成果技术水平"), React.createElement("dd", null, item.level)
        )
      ),
      React.createElement("section", { className: "detail-section" },
        React.createElement("h3", null, "转化信息"),
        React.createElement("dl", null,
          React.createElement("dt", null, "成果关键字"), React.createElement("dd", null, item.keywords),
          React.createElement("dt", null, "联系人"), React.createElement("dd", null, item.contact),
          React.createElement("dt", null, "拟采取的转化方式"), React.createElement("dd", null, item.transferMode),
          React.createElement("dt", null, "转化说明"), React.createElement("dd", null, item.transferNote)
        )
      )
    )
  );
}

function virtualizeCollection(items, targetTotal, keyPrefix) {
  if (!items.length || items.length >= targetTotal) return items;
  return Array.from({ length: targetTotal }, (_, index) => {
    const source = items[index % items.length];
    return { ...source, _virtualKey: `${keyPrefix}-${index + 1}-${source.id}` };
  });
}

function ExpertsLibrary({ initialQuery = "" }) {
  const [experts, setExperts] = useState([]);
  const [q, setQ] = useState(initialQuery);
  const [fieldValue, setFieldValue] = useState("");
  const [regionValue, setRegionValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [orgTypeValue, setOrgTypeValue] = useState("");
  const [activeExpert, setActiveExpert] = useState(null);
  const [inviteNotice, setInviteNotice] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const hasActiveFilters = Boolean(q || fieldValue || regionValue || titleValue || orgTypeValue);
  const filtered = useMemo(() => {
    const matching = experts.filter((item) => {
      const text = `${item.intro} ${item.name} ${item.title} ${item.organization} ${item.region} ${item.field} ${item.keywords} ${item.researchDirection} ${item.achievements} ${item.bio}`.toLowerCase();
      return text.includes(q.toLowerCase())
        && (!fieldValue || item.field === fieldValue)
        && (!regionValue || item.region === regionValue)
        && (!titleValue || item.title === titleValue)
        && (!orgTypeValue || item.orgType === orgTypeValue);
    });
    return hasActiveFilters ? matching : virtualizeCollection(matching, demoTotals.experts, "expert");
  }, [experts, q, fieldValue, regionValue, titleValue, orgTypeValue, hasActiveFilters]);
  useEffect(() => { api.get("/api/experts").then((result) => setExperts(result.experts)); }, []);
  useEffect(() => { setPage(1); }, [q, fieldValue, regionValue, titleValue, orgTypeValue]);
  const fields = [...new Set(experts.map((item) => item.field))].filter(Boolean);
  const regions = [...new Set(experts.map((item) => item.region))].filter(Boolean);
  const titles = [...new Set(experts.map((item) => item.title))].filter(Boolean);
  const orgTypes = [...new Set(experts.map((item) => item.orgType))].filter(Boolean);
  const avgActive = filtered.length ? Math.round(filtered.reduce((sum, item) => sum + Number(item.activeScore || 0), 0) / filtered.length) : 0;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedExperts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return React.createElement("section", { className: "library-page" },
    React.createElement("div", { className: "library-hero experts-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "Expert Intelligence Network"),
        React.createElement("h2", null, "长三角专家资源库"),
        React.createElement("p", null, "围绕新材料、智能制造、低空经济、集成电路、生物医药、节能环保等产业方向，沉淀专家画像、专业特长、区域协同和可承接任务。")
      ),
      React.createElement("div", { className: "library-kpis" },
        libraryKpi("入库专家", demoTotals.experts),
        libraryKpi("当前筛选", filtered.length),
        libraryKpi("平均活跃度", `${avgActive || "--"}%`)
      )
    ),
    React.createElement("div", { className: "library-toolbar" },
      React.createElement("input", { placeholder: "搜索姓名、机构、专业特长、研究方向", value: q, onChange: (e) => setQ(e.target.value) }),
      React.createElement("div", { className: "advanced-selects" },
        filterSelect("全部领域", fieldValue, setFieldValue, fields),
        filterSelect("全部地域", regionValue, setRegionValue, regions),
        filterSelect("全部职称", titleValue, setTitleValue, titles),
        filterSelect("全部单位性质", orgTypeValue, setOrgTypeValue, orgTypes)
      ),
      React.createElement("div", { className: "chip-row wide" },
        React.createElement("button", { className: fieldValue === "" ? "chip active" : "chip", onClick: () => setFieldValue("") }, "全部领域"),
        fields.map((field) => React.createElement("button", { className: fieldValue === field ? "chip active" : "chip", key: field, onClick: () => setFieldValue(field) }, field))
      )
    ),
    React.createElement("div", { className: "catalog-grid expert-grid-pro" }, pagedExperts.map((expert) =>
      React.createElement("article", { className: "card expert-card expert-card-pro", key: expert._virtualKey || expert.id },
        React.createElement("div", { className: "expert-head" },
          React.createElement("span", { className: "avatar expert-avatar" }, expert.name.slice(0, 1)),
          React.createElement("div", null, React.createElement("h3", null, expert.name), React.createElement("span", { className: "eyebrow" }, expert.title))
        ),
        React.createElement("p", null, expert.organization),
        React.createElement("div", { className: "meta" },
          React.createElement("span", { className: "tag" }, expert.field),
          React.createElement("span", { className: "tag accent" }, expert.region),
          expert.education && React.createElement("span", { className: "tag" }, expert.education),
          React.createElement("span", { className: "tag" }, `活跃度 ${expert.activeScore}`)
        ),
        React.createElement("p", null, expert.intro || expert.bio),
        React.createElement("small", null, expert.keywords),
        React.createElement("div", { className: "expert-actions" },
          React.createElement("button", { className: "secondary", onClick: () => setActiveExpert(expert) }, "查看画像"),
          React.createElement("button", { className: "ghost", onClick: () => setInviteNotice(`已向${expert.name}发送对接邀约，科小果将自动整理需求摘要和访谈提纲。`) }, "邀约对接")
        )
      )
    )),
    React.createElement(Pagination, { page: currentPage, totalPages, total: filtered.length, pageSize, onPageChange: setPage }),
    inviteNotice && React.createElement("div", { className: "toast", onClick: () => setInviteNotice("") }, inviteNotice),
    activeExpert && React.createElement(ExpertProfileModal, { expert: activeExpert, onClose: () => setActiveExpert(null) })
  );
}

function filterSelect(label, value, onChange, options) {
  return React.createElement("select", { value, onChange: (event) => onChange(event.target.value) },
    React.createElement("option", { value: "" }, label),
    options.map((item) => React.createElement("option", { key: item, value: item }, item))
  );
}

function ExpertProfileModal({ expert, onClose }) {
  return React.createElement("div", { className: "modal-backdrop" },
    React.createElement("section", { className: "expert-profile-modal" },
      React.createElement("button", { className: "modal-close", onClick: onClose }, "×"),
      React.createElement("div", { className: "expert-profile-head" },
        React.createElement("span", { className: "avatar expert-avatar" }, expert.name.slice(0, 1)),
        React.createElement("div", null,
          React.createElement("h2", null, expert.name),
          React.createElement("p", null, `${expert.title}｜${expert.organization}`)
        ),
        React.createElement("div", { className: "manager-score" }, `${expert.activeScore}%`)
      ),
      React.createElement("div", { className: "expert-profile-grid" },
        [
          ["专家介绍", expert.intro],
          ["专业特长", expert.keywords],
          ["战略性新兴产业分类", expert.field],
          ["工作业绩及专业资质", expert.achievements],
          ["所属地域", expert.region],
          ["研究方向", expert.researchDirection],
          ["所属单位", expert.organization],
          ["单位性质", expert.orgType],
          ["职务", expert.position],
          ["现所在部门", expert.department],
          ["专业类别", expert.category],
          ["专业技术职称", expert.title],
          ["性别", expert.gender],
          ["最高学历", expert.education],
          ["毕业院校", expert.graduatedFrom],
          ["联系方式", expert.contact],
          ["相关研究成果", expert.relatedResults],
          ["个人简介", expert.bio]
        ].map(([label, value]) =>
          React.createElement("div", { key: label }, React.createElement("b", null, label), React.createElement("p", null, value))
        )
      ),
      React.createElement("div", { className: "task-chain" },
        ["生成专家画像", "匹配企业需求", "发送访谈提纲", "进入智能体预沟通"].map((step, index) =>
          React.createElement("div", { className: "task-node", key: step },
            React.createElement("b", null, `0${index + 1}`),
            React.createElement("div", null, React.createElement("h3", null, step), React.createElement("p", null, index < 2 ? "已完成" : "待执行"))
          )
        )
      )
    )
  );
}

function DemandsLibrary({ initialQuery = "", onSelectDemand }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState(initialQuery);
  const [fieldValue, setFieldValue] = useState("");
  const [activeDemand, setActiveDemand] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const hasActiveFilters = Boolean(q || fieldValue);
  const filtered = useMemo(() => {
    const matching = items.filter((item) => {
      const text = `${item.name} ${item.company} ${item.field} ${item.problem} ${item.region} ${item.keywords}`.toLowerCase();
      return text.includes(q.toLowerCase()) && (!fieldValue || item.field === fieldValue);
    });
    return hasActiveFilters ? matching : virtualizeCollection(matching, demoTotals.demands, "demand");
  }, [items, q, fieldValue, hasActiveFilters]);
  useEffect(() => { api.get("/api/demands").then((result) => setItems(result.demands)); }, []);
  useEffect(() => { setPage(1); }, [q, fieldValue]);
  const fields = [...new Set(items.map((item) => item.field))].filter(Boolean);
  const budgetRecords = hasActiveFilters ? filtered : items;
  const budgetTotal = budgetRecords.reduce((sum, item) => sum + Number(item.budgetAmount || 0), 0);
  const displayBudgetTotal = !hasActiveFilters && items.length
    ? budgetTotal * (demoTotals.demands / items.length)
    : budgetTotal;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return React.createElement("section", { className: "library-page" },
    React.createElement("div", { className: "library-hero demands-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "Enterprise Demand Market"),
        React.createElement("h2", null, "企业技术需求库"),
        React.createElement("p", null, "集中展示与长三角企业真实技术难题、预算金额、合作方式、有效期和现有基础，智能体可据此生成标准化需求单和撮合任务。")
      ),
      React.createElement("div", { className: "library-kpis" },
        libraryKpi("入库需求", demoTotals.demands),
        libraryKpi("当前筛选", filtered.length),
        libraryKpi("预算总额", formatBudgetTotal(displayBudgetTotal))
      )
    ),
    React.createElement("div", { className: "library-toolbar" },
      React.createElement("input", { placeholder: "搜索需求、企业、领域、地区或关键词", value: q, onChange: (e) => setQ(e.target.value) }),
      React.createElement("div", { className: "chip-row" },
        React.createElement("button", { className: fieldValue === "" ? "chip active" : "chip", onClick: () => setFieldValue("") }, "全部领域"),
        fields.map((field) => React.createElement("button", { className: fieldValue === field ? "chip active" : "chip", key: field, onClick: () => setFieldValue(field) }, field))
      )
    ),
    React.createElement("div", { className: "table-like demand-market" },
      pagedItems.map((item) => React.createElement("article", { className: "demand-row", key: item._virtualKey || item.id },
        React.createElement("div", null,
          React.createElement("h3", null, item.name),
          React.createElement("p", null, item.detail || item.problem),
          React.createElement("small", null, `指标：${item.technicalIndicators}`)
        ),
        React.createElement("div", null, React.createElement("span", { className: "tag" }, item.company), React.createElement("span", { className: "tag accent" }, item.region)),
        React.createElement("div", null,
          React.createElement("strong", null, item.budgetText || `${Math.round(item.budgetAmount / 10000)}万`),
          React.createElement("span", { className: "eyebrow" }, item.cooperation),
          React.createElement("span", { className: "demand-status" }, item.demandType),
          item.authenticity && React.createElement("span", { className: "demand-auth-badge" }, `${item.authenticity.level} ${item.authenticity.score}分`)
        ),
        React.createElement("div", { className: "demand-actions" },
          React.createElement("button", { className: "secondary", onClick: () => onSelectDemand(item) }, "查看匹配"),
          React.createElement("button", { className: "ghost", onClick: () => setActiveDemand(item) }, "详情")
        )
      ))
    ),
    React.createElement(Pagination, { page: currentPage, totalPages, total: filtered.length, pageSize, onPageChange: setPage }),
    activeDemand && React.createElement(DemandDetailModal, { item: activeDemand, onClose: () => setActiveDemand(null), onMatch: () => onSelectDemand(activeDemand) })
  );
}

function DemandDetailModal({ item, onClose, onMatch }) {
  const auth = item.authenticity;
  const sections = [
    ["基本信息", [["需求名称", item.name], ["所属单位或公司名称", item.company], ["技术领域", item.field], ["需求类型", item.demandType], ["所属地区", item.region]]],
    ["需求内容", [["需求详情", item.detail], ["技术指标", item.technicalIndicators], ["拟解决的技术难题", item.problem], ["现有基础条件", item.foundation]]],
    ["合作与时效", [["合作方式", item.cooperation], ["单位性质", item.orgType], ["预算金额", item.budgetText || item.budgetAmount], ["有效期", item.validUntilText || item.validUntil], ["更新时间", item.updatedAt], ["信息来源", item.source], ["企业联系人/复核人", item.contact], ["补证材料记录", item.evidence]]]
  ];
  return React.createElement("div", { className: "modal-backdrop" },
    React.createElement("section", { className: "detail-modal" },
      React.createElement("button", { className: "modal-close", onClick: onClose }, "×"),
      React.createElement("div", { className: "detail-head" },
        React.createElement("div", { className: "detail-cover" }, "需求库"),
        React.createElement("div", null,
          React.createElement("h2", null, item.name),
          React.createElement("p", null, `${item.company}｜${item.field}｜${item.region}`),
          React.createElement("div", { className: "meta" },
            React.createElement("span", { className: "tag" }, item.cooperation || "合作方式未说明"),
            React.createElement("span", { className: "tag accent" }, item.budgetText || "预算面议"),
            React.createElement("span", { className: "tag" }, item.validUntilText || item.validUntil || "有效期未说明")
          )
        ),
        React.createElement("aside", { className: "detail-actions" },
          React.createElement("button", { className: "primary", onClick: onMatch }, "进入智能匹配"),
          React.createElement("button", { className: "ghost", onClick: onClose }, "关闭")
        )
      ),
      auth && React.createElement("section", { className: "detail-section authenticity-detail" },
        React.createElement("h3", null, "真实性评估"),
        React.createElement("div", { className: "authenticity-preview compact" },
          React.createElement("div", { className: "auth-score-ring", style: { "--score": `${auth.score}%` } },
            React.createElement("strong", null, auth.score),
            React.createElement("span", null, auth.level)
          ),
          React.createElement("div", null,
            React.createElement("b", null, auth.recommendation),
            React.createElement("p", null, `评估时间：${formatTime(auth.evaluatedAt)}`),
            React.createElement("div", { className: "auth-tag-row" },
              (auth.riskTags?.length ? auth.riskTags : auth.strengths || ["暂无明显风险"]).map((tag) => React.createElement("span", { className: "tag accent", key: tag }, tag))
            )
          )
        )
      ),
      sections.map((section) => React.createElement("section", { className: "detail-section", key: section[0] },
        React.createElement("h3", null, section[0]),
        React.createElement("dl", null, section[1].map(([label, value]) => [
          React.createElement("dt", { key: `${label}-dt` }, label),
          React.createElement("dd", { key: `${label}-dd` }, value || "未说明")
        ]))
      ))
    )
  );
}

function libraryKpi(label, value) {
  return React.createElement("div", { className: "library-kpi" },
    React.createElement("strong", null, value),
    React.createElement("span", null, label)
  );
}

function formatBudgetTotal(amount) {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1).replace(/\.0$/, "")}亿`;
  }
  return `${Math.round(amount / 10000)}万`;
}

function TechManagers({ demands, selectedDemand, onSelectDemand }) {
  const [allManagers, setAllManagers] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [dispatchLog, setDispatchLog] = useState([]);
  const [industryFilter, setIndustryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const demandId = selectedDemand?.id || demands[0]?.id;

  useEffect(() => {
    api.get("/api/tech-managers").then((result) => setAllManagers(result.techManagers));
  }, []);

  useEffect(() => {
    if (demandId) loadRecommendations(demandId);
  }, [demandId]);

  async function loadRecommendations(id) {
    const result = await api.get(`/api/manager-recommendations/${id}`);
    setRecommendation(result);
    setDispatchLog([]);
  }

  function dispatchManager(manager) {
    const demandName = activeDemand?.name || "当前需求";
    setDispatchLog([
      `已派发给${manager.name}：${demandName}`,
      "科小果已生成需求摘要、专家候选清单、访谈提纲。",
      "下一步：经理人将在24小时内确认企业访谈时间并启动专家邀约。"
    ]);
  }

  const managerBase = recommendation?.managers || allManagers;
  const industries = [...new Set(allManagers.flatMap((item) => String(item.industries || "").split(/[，,、;；]/)).map((item) => item.trim()).filter(Boolean))];
  const managerRegions = [...new Set(allManagers.map((item) => item.region).filter(Boolean))];
  const managers = managerBase.filter((item) =>
    (!industryFilter || String(item.industries || "").includes(industryFilter)) &&
    (!regionFilter || item.region === regionFilter)
  );
  const activeDemand = recommendation?.demand || selectedDemand || demands[0];

  return React.createElement("div", { className: "manager-page" },
    React.createElement("section", { className: "manager-hero" },
      React.createElement("div", null,
        React.createElement("span", { className: "eyebrow" }, "Technology Broker Workspace"),
        React.createElement("h2", null, "技术经理人撮合推荐中心"),
        React.createElement("p", null, "企业提交需求后，平台不仅推荐专家，也会把撮合任务派发给合适的技术经理人，由经理人承接需求复核、专家邀约、样件验证、合同条款和投融资推进。")
      ),
      React.createElement("div", { className: "manager-flow" },
        ["企业需求", "专属智能体", "推荐专家", "技术经理人", "转化项目"].map((step, index) =>
          React.createElement("span", { className: index < 4 ? "done" : "", key: step }, step)
        )
      )
    ),
    React.createElement("section", { className: "manager-layout" },
      React.createElement("aside", { className: "panel demand-picker" },
        React.createElement("h2", null, "选择待撮合需求"),
        React.createElement("div", { className: "manager-demand-list" },
          demands.map((demand) =>
            React.createElement("button", {
              key: demand.id,
              className: activeDemand?.id === demand.id ? "active" : "",
              onClick: () => {
                onSelectDemand(demand);
                loadRecommendations(demand.id);
              }
            },
              React.createElement("b", null, demand.name),
              React.createElement("span", null, `${demand.company} · ${demand.region} · ${Math.round((demand.budgetAmount || 0) / 10000)}万`)
            )
          )
        )
      ),
      React.createElement("section", { className: "panel manager-main" },
        React.createElement("div", { className: "panel-header" },
          React.createElement("div", null,
            React.createElement("h2", null, activeDemand ? activeDemand.name : "经理人推荐"),
            React.createElement("span", { className: "eyebrow" }, activeDemand ? `${activeDemand.company}｜${activeDemand.field}｜${activeDemand.cooperation}` : "请选择一个需求")
          ),
          activeDemand && React.createElement("button", { className: "secondary", onClick: () => loadRecommendations(activeDemand.id) }, "重新撮合")
        ),
        React.createElement("div", { className: "manager-filter-row" },
          filterSelect("全部产业", industryFilter, setIndustryFilter, industries),
          filterSelect("全部地域", regionFilter, setRegionFilter, managerRegions)
        ),
        activeDemand && React.createElement("div", { className: "manager-brief" },
          React.createElement("div", null, React.createElement("b", null, "技术难题"), React.createElement("p", null, activeDemand.problem)),
          React.createElement("div", null, React.createElement("b", null, "验收指标"), React.createElement("p", null, activeDemand.technicalIndicators)),
          React.createElement("div", null, React.createElement("b", null, "现有基础"), React.createElement("p", null, activeDemand.foundation))
        ),
        React.createElement("div", { className: "manager-grid" },
          managers.map((manager, index) =>
            React.createElement("article", { className: index === 0 ? "manager-card best" : "manager-card", key: manager.id },
              React.createElement("div", { className: "manager-card-head" },
                React.createElement("span", { className: "avatar manager-avatar" }, manager.name.slice(0, 1)),
                React.createElement("div", null,
                  React.createElement("h3", null, manager.name),
                  React.createElement("span", { className: "eyebrow" }, `${manager.title}｜${manager.region}`)
                ),
                React.createElement("div", { className: "manager-score" }, `${manager.recommendScore || manager.responseRate}%`)
              ),
              React.createElement("p", null, manager.organization),
              React.createElement("p", null, manager.focus),
              React.createElement("div", { className: "meta" },
                manager.industries.split(",").slice(0, 3).map((tag) => React.createElement("span", { className: "tag", key: tag }, tag)),
                React.createElement("span", { className: "tag accent" }, `成交${manager.dealCount}项`)
              ),
              React.createElement("small", null, manager.reason || manager.serviceTags),
              React.createElement("button", { className: "primary", onClick: () => dispatchManager(manager) }, "派发撮合任务")
            )
          )
        )
      ),
      React.createElement("aside", { className: "panel manager-tasks" },
        React.createElement("h2", null, "经理人收到的任务"),
        React.createElement("div", { className: "task-chain" },
          (recommendation?.tasks || []).map((task, index) =>
            React.createElement("div", { className: "task-node", key: task.step },
              React.createElement("b", null, `0${index + 1}`),
              React.createElement("div", null,
                React.createElement("h3", null, task.step),
                React.createElement("span", { className: "tag accent" }, task.status),
                React.createElement("p", null, task.output),
                React.createElement("small", null, `负责人：${task.owner}`)
              )
            )
          )
        ),
        React.createElement("div", { className: "manager-agent-box" },
          React.createElement("h3", null, "经理人专属智能体"),
          React.createElement("p", null, "自动汇总企业需求、专家回复、专利风险和政策机会，为经理人生成访谈提纲、对接纪要、技术合同要点和下一步跟进提醒。")
        ),
        dispatchLog.length > 0 && React.createElement("div", { className: "dispatch-result" },
          React.createElement("h3", null, "撮合派发结果"),
          dispatchLog.map((line) => React.createElement("p", { key: line }, line))
        )
      )
    )
  );
}

const fallbackSpecialistAgents = [
  { id: "generalAgent", name: "总智能体", nickname: "科小果", avatar: "果", desc: "统一问答、联网检索、任务路由和演示模式讲解。", prompt: "请用领导能听懂的方式介绍平台如何完成需求解析、专家成果匹配、经理人磋商、政策资金建议和报告输出。" },
  { id: "transferOfficer", name: "成果转化官", nickname: "果小转", avatar: "转", desc: "理解成果并生成结构化画像，智能匹配企业。", prompt: "请把高强耐蚀Al-Zn-Mg铝合金成果整理成企业看得懂的转化画像，并推荐3类应用企业。" },
  { id: "demandAnalyst", name: "需求解析师", nickname: "需小析", avatar: "析", desc: "拆解模糊需求，输出标准化需求单。", prompt: "请把“无人装备需要轻量化耐腐蚀材料”拆成标准需求单，并列出还需要追问企业的5个问题。" },
  { id: "patentHunter", name: "专利猎手", nickname: "专小猎", avatar: "猎", desc: "执行全球专利检索与可行性评估。", prompt: "请围绕Al-Zn-Mg特种铝合金在无人装备中的应用，给出专利检索关键词和FTO风险初评。" },
  { id: "policyAdvisor", name: "政策顾问", nickname: "策小通", avatar: "策", desc: "实时解读政策，生成申报材料草稿。", prompt: "请联网搜索并判断高强铝合金无人装备项目可以关注哪些科技成果转化和低空经济政策。" },
  { id: "dueDiligence", name: "技术尽调助手", nickname: "尽小研", avatar: "研", desc: "分析技术可行性与商业化路径。", prompt: "请从技术成熟度、量产稳定性、成本、质量责任和验证计划五方面尽调这个铝合金项目。" },
  { id: "financingOfficer", name: "投融资对接官", nickname: "融小桥", avatar: "融", desc: "匹配科创基金与投资机构。", prompt: "请为高强铝合金材料成果设计一页投融资对接话术，说明市场、壁垒、里程碑和资金用途。" },
  { id: "enterpriseAgent", name: "企业专属智能体", nickname: "科小企", avatar: "企", desc: "帮助企业维护介绍、登记真实需求、追问专家并推动需求转化。", prompt: "请把企业一句话技术需求整理为可匹配专家的标准需求单，并代表企业向专家方发起第一轮追问。" },
  { id: "expertAgent", name: "专家专属智能体", nickname: "科小专", avatar: "专", desc: "帮助专家沉淀画像、包装成果、回应企业技术问题。", prompt: "请把专家成果包装成企业能看懂的转化方案，并回应企业关于成本、成熟度和交付周期的问题。" },
  { id: "managerAgent", name: "技术经理人智能体", nickname: "科小经", avatar: "经", desc: "拆解撮合任务、生成访谈提纲、对接纪要和推进计划。", prompt: "请根据当前需求生成技术经理人的撮合任务清单、访谈提纲和下一步推进计划。" },
  { id: "enterpriseCompanion", name: "企业成长陪伴智能体", nickname: "企专伴", avatar: "伴", desc: "发现企业隐性技术需求、申报短板和成长路径，陪伴企业升级。", prompt: "请帮我做一次企业成长体检：判断我在技术升级、知识产权、高企/专精特新申报、产品迭代和专家咨询方面有哪些隐性需求。" }
];

function getAgentRecommendedQuestions(agent) {
  const questions = String(agent?.demoQuestions || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^(Q|问题)[：:]/i.test(line))
    .map((line) => line.replace(/^(Q|问题)[：:]\s*/i, ""))
    .filter(Boolean);
  if (questions.length) return questions;
  return agent?.prompt ? [agent.prompt] : ["请结合当前平台数据给出一份可执行的分析建议。"];
}

function Agents({ demands, selectedDemand, onConversation }) {
  const [agents, setAgents] = useState(fallbackSpecialistAgents);
  const [selectedRole, setSelectedRole] = useState("generalAgent");
  const [question, setQuestion] = useState("");
  const [modelStatus, setModelStatus] = useState({ modelReady: false, model: "检测中" });
  const [webSearch, setWebSearch] = useState(false);
  const [agentMessages, setAgentMessages] = useState([
    { sender: "user", text: "我想把铝合金材料成果匹配给无人装备企业，应该先做什么？" },
    { sender: "specialist", text: "成果转化官：先建立成果画像，再匹配应用场景。建议抽取技术指标、成熟度、知识产权、样件能力、合作方式和目标企业六类字段。" }
  ]);
  const [stagedConversation, setStagedConversation] = useState(null);
  const [stagedMessages, setStagedMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [stepping, setStepping] = useState(false);
  const [done, setDone] = useState(false);
  const [autoNegotiation, setAutoNegotiation] = useState(true);

  useEffect(() => {
    api.get("/api/model-status").then(setModelStatus);
    api.get("/api/agents").then((result) => {
      if (result.agents?.length) {
        const normalizedAgents = result.agents.map((agent) => ({
          ...agent,
          id: agent.role || agent.id,
          desc: agent.desc || agent.category || "",
          prompt: agent.prompt || agent.demoQuestions || "请根据你的专业职责给出可执行建议。"
        }));
        setAgents(normalizedAgents);
        setSelectedRole(normalizedAgents[0].id);
      }
    }).catch(() => setAgents(fallbackSpecialistAgents));
  }, []);

  useEffect(() => {
    if (!autoNegotiation || stepping || done) return undefined;
    const timer = setTimeout(() => nextNegotiation(false), stagedMessages.length ? 2300 : 600);
    return () => clearTimeout(timer);
  }, [autoNegotiation, stepping, done, stagedMessages.length, stagedConversation?.id]);

  function chooseAgent(agent) {
    const roleId = agent.role || agent.id;
    setSelectedRole(roleId);
    setQuestion("");
    setWebSearch(roleId === "policyAdvisor" || roleId === "patentHunter" || roleId === "ipComplianceAgent");
    setAgentMessages([
      { sender: "specialist", text: `${agent.nickname}：请选择下方推荐问题，或直接输入你想咨询的内容。我会按“${agent.name}”的职责直接给出判断、依据和下一步建议。` }
    ]);
  }

  async function askSpecialist(event) {
    event.preventDefault();
    if (!question.trim()) return;
    const userMessage = { sender: "user", text: question };
    setAgentMessages((items) => [...items, userMessage]);
    setAsking(true);
    const result = await api.post("/api/agent-answer", { role: selectedRole, text: question, webSearch });
    setAgentMessages((items) => [...items, { sender: "specialist", text: result.reply }]);
    setQuestion("");
    setAsking(false);
  }

  async function nextNegotiation(reset = false) {
    setStepping(true);
    if (reset) {
      setAutoNegotiation(false);
      setStagedConversation(null);
      setStagedMessages([]);
      setDone(false);
    }
    const result = await api.post("/api/agent-dialogs/next", {
      conversationId: reset ? null : stagedConversation?.id,
      demandId: selectedDemand?.id || demands[0]?.id,
      reset,
      webSearch: true
    });
    onConversation(result.conversation);
    setStagedConversation(result.conversation);
    setStagedMessages(result.messages);
    setDone(result.done);
    setStepping(false);
  }

  const currentAgent = agents.find((item) => item.id === selectedRole || item.role === selectedRole) || fallbackSpecialistAgents[0];
  const recommendedQuestions = getAgentRecommendedQuestions(currentAgent);

  return React.createElement("div", { className: "agent-square" },
    React.createElement("section", { className: "panel agent-workbench" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null,
          React.createElement("h2", null, "专业智能体工作台"),
          React.createElement("span", { className: "eyebrow" }, "选择一个人工智能助手，输入问题，它会按专业分工回答")
        ),
        React.createElement("span", { className: modelStatus.modelReady ? "model-pill ready" : "model-pill" },
          modelStatus.modelReady ? "智能服务已连接" : "智能服务已就绪"
        )
      ),
      React.createElement("div", { className: "agent-layout" },
        React.createElement("div", { className: "agent-roster" }, agents.map((agent) =>
          React.createElement("button", {
            key: agent.id || agent.role,
            className: selectedRole === (agent.role || agent.id) ? "agent-role active" : "agent-role",
            onClick: () => chooseAgent(agent)
          },
            React.createElement("i", null, agent.avatar),
            React.createElement("b", null, `${agent.nickname} · ${agent.name}`),
            React.createElement("span", null, agent.desc)
          )
        )),
        React.createElement("div", { className: "agent-console" },
          React.createElement("div", { className: "console-head" },
            React.createElement("div", { className: "agent-orb" }, currentAgent.avatar),
            React.createElement("div", null, React.createElement("h3", null, `${currentAgent.nickname} · ${currentAgent.name}`), React.createElement("p", null, currentAgent.desc))
          ),
          React.createElement("div", { className: "messages specialist-messages" }, agentMessages.map((item, index) =>
            React.createElement("div", { className: `message ${item.sender === "user" ? "enterprise" : "specialist"}`, key: index }, item.text)
          )),
          React.createElement("div", { className: "agent-recommended-questions" },
            React.createElement("b", null, "推荐问题"),
            React.createElement("div", null, recommendedQuestions.map((item) => React.createElement("button", {
              type: "button",
              key: item,
              onClick: () => setQuestion(item)
            }, item)))
          ),
          React.createElement("form", { className: "chat-form", onSubmit: askSpecialist },
            React.createElement("input", { value: question, onChange: (e) => setQuestion(e.target.value), placeholder: "输入你想咨询的问题，或点击上方推荐问题" }),
            React.createElement("label", { className: "search-toggle" },
              React.createElement("input", { type: "checkbox", checked: webSearch, onChange: (e) => setWebSearch(e.target.checked) }),
              React.createElement("span", null, "联网搜索")
            ),
            React.createElement("button", { className: "primary", disabled: asking }, asking ? "思考中..." : "发送")
          )
        )
      )
    ),
    React.createElement("section", { className: "panel staged-chat" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null,
          React.createElement("h2", null, "科小果智能体技术洽谈"),
          React.createElement("span", { className: "eyebrow" }, "智能体默认接管洽谈，自动模拟需求方、专家方和平台方连续沟通")
        ),
        React.createElement("div", { className: "hero-actions" },
          React.createElement("button", { className: "ghost", onClick: () => nextNegotiation(true), disabled: stepping }, "重新开始"),
          React.createElement("button", { className: autoNegotiation ? "primary" : "secondary", onClick: () => setAutoNegotiation((value) => !value), disabled: done }, autoNegotiation ? "暂停托管" : "智能体接管")
        )
      ),
      React.createElement("div", { className: "match-spectacle" },
        React.createElement("div", { className: "match-ring", style: { "--score": "96%" } },
          React.createElement("strong", null, "96%"),
          React.createElement("span", null, "综合匹配")
        ),
        React.createElement("div", { className: "match-bars" },
          matchMetric("技术指标", 98),
          matchMetric("应用场景", 96),
          matchMetric("产业化", 88),
          matchMetric("区域协同", 92)
        ),
        React.createElement("div", { className: "match-badges" },
          ["Al-Zn-Mg", "无人装备", "耐盐雾", "动态冲击", "年采200吨"].map((tag) => React.createElement("span", { className: "tag accent", key: tag }, tag))
        )
      ),
      React.createElement("div", { className: "messages staged-messages" },
        stagedMessages.length ? stagedMessages.map((item) => React.createElement("div", { className: `message ${item.sender}`, key: item.id },
          React.createElement("b", null, stagedSpeakerName(item.sender)),
          React.createElement("p", null, item.text)
        )) :
          React.createElement("div", { className: "empty" }, "科小果正在接管洽谈，会自动从需求方开场开始。")
      ),
      done && React.createElement("div", { className: "match-final-card" },
        React.createElement("b", null, "最终撮合建议"),
        React.createElement("p", null, "建议进入NDA、样件试制、盐雾/疲劳/焊接验证和年度供应框架谈判。平台可继续派发技术经理人跟进，并生成对接纪要。"),
        React.createElement("div", { className: "final-spark-grid" },
          ["技术适配 96%", "商业可行 88%", "供应风险 中低", "建议推进"].map((item) => React.createElement("span", { key: item }, item))
        )
      )
    )
  );
}

function stagedSpeakerName(sender) {
  return {
    lobsterDemand: "科小果-需求方",
    lobsterExpert: "科小果-专家方",
    enterpriseAgent: "科小企",
    expertAgent: "科小专",
    managerAgent: "科小经",
    agent: "平台撮合智能体"
  }[sender] || "智能体";
}

function matchMetric(label, value) {
  return React.createElement("div", { className: "match-metric" },
    React.createElement("span", null, label),
    React.createElement("i", null, React.createElement("b", { style: { width: `${value}%` } })),
    React.createElement("em", null, `${value}%`)
  );
}

function DemoVideo() {
  const [playing, setPlaying] = useState(true);
  const matchCases = [
    ["无人装备高强铝合金材料", "顾承铝团队", "林芷晴", 96, "样件验证"],
    ["MEMS压力传感芯片可靠性提升", "马清晖", "贺云舟", 92, "可靠性尽调"],
    ["工业废水高盐有机物资源化处理", "许南乔", "周明澈", 89, "园区试点"],
    ["低空物流无人机复合材料机身减重", "邵景行", "林芷晴", 94, "适航验证"]
  ];
  const dealDialogue = [
    ["demand-side", "需求方：我们是长三角无人装备制造企业，正在寻找新一代高强耐蚀轻量化铝合金，用于无人机和无人艇结构件。"],
    ["expert-side", "专家方：您好。我们团队的Al-Zn-Mg特种铝合金正面向无人装备场景做中试验证，核心优势是高强韧、耐盐雾和焊接可加工。"],
    ["demand-side", "需求方：我们的硬指标是抗拉强度≥450MPa，延伸率≥7%，盐雾1000小时无明显腐蚀，同时要能MIG/TIG焊接。"],
    ["expert-side", "专家方：这些指标与我们的材料画像基本吻合。当前抗拉强度可达450MPa以上，屈服强度≥380MPa，厚度方向压缩强度可达600MPa以上。"],
    ["demand-side", "需求方：我们最担心中试数据和批量稳定性。你们现在是实验室阶段，还是已经有多批次验证？"],
    ["expert-side", "专家方：小试已完成，中试正在推进。已完成5批中试，抗拉强度波动约±15MPa，屈服强度波动约±12MPa，延伸率稳定在7%到8%。"],
    ["demand-side", "需求方：成本方面呢？我们每年大约200吨，如果比7075-T73贵太多，采购端压力会比较大。"],
    ["expert-side", "专家方：初期目标价约140到160元/kg，比7075-T73高10%到15%。但随着产能放大，预计可下降到120到130元/kg。"],
    ["demand-side", "需求方：如果材料出现裂纹或断裂，质量责任怎么界定？我们需要明确售后响应和替代方案。"],
    ["expert-side", "专家方：建议合同约定3年质量保证期。若成分或力学性能不达标，100%退换；若涉及设计或加工，需要双方联合失效分析。"],
    ["demand-side", "需求方：我们希望先小批量试用，验证无人艇结构件的盐雾、疲劳和焊接性能。可以配合吗？"],
    ["expert-side", "专家方：可以。建议先签NDA和样品试用合同，提供多厚度板材、焊接参数窗口、热处理建议和每批检测报告。"],
    ["demand-side", "需求方：如果样件通过，我们希望进入长期供应和联合开发。知识产权和专利许可怎么处理？"],
    ["expert-side", "专家方：采购材料产品无需额外支付专利许可费，材料价格已包含知识产权成本。联合开发部分可另行约定新应用场景成果权属。"],
    ["platform-side", "平台撮合官：本轮对接结论：双方可进入“样件试制-盐雾/疲劳测试-焊接工艺验证-年度供应框架”阶段，平台将生成对接纪要与材料清单。"]
  ];
  const liveEvents = [
    ["09:30", "长三角无人装备制造有限公司", "发布轻量化铝合金材料需求，预算1200万元，年采购约200吨。"],
    ["09:31", "需求解析师", "抽取关键指标：抗拉强度≥450MPa、盐雾1000小时、MIG/TIG焊接。"],
    ["09:32", "成果转化官", "生成成果画像：Al-Zn-Mg特种铝合金，中试阶段，适配无人机/无人艇。"],
    ["09:33", "匹配引擎", "推荐顾承铝团队，综合匹配96%，技术指标匹配98%。"],
    ["09:34", "专利猎手", "启动FTO初评，锁定成分配比、过渡族元素和热处理工艺权利要求。"],
    ["09:35", "政策顾问", "匹配首批次新材料、低空经济和科技成果转化支持政策。"],
    ["09:36", "投融资对接官", "推送3家新材料基金和1家低空经济产业基金。"],
    ["09:37", "科小果智能体", "双方开始技术洽谈：成熟度、成本、量产稳定性、质量责任逐项确认。"]
  ];
  const agentCollab = [
    ["需小析", "已把企业原始需求拆成“指标-难题-基础条件-预算-验收”五段。"],
    ["果小转", "已从成果库锁定Al-Zn-Mg特种铝合金和2个备选材料成果。"],
    ["专小猎", "已生成FTO检索词：Al-Zn-Mg、Zr/Ti/Mn强化、无人艇结构件。"],
    ["策小通", "已联网上查政策，推荐低空经济、首批次新材料、概念验证方向。"],
    ["尽小研", "建议先做盐雾、疲劳、焊接热影响区三组验证。"],
    ["融小桥", "已匹配2家新材料基金和1家低空经济产业基金。"]
  ];
  const frames = [
    ["01", "需求库信息填写", "无人装备制造商填写强度、冲击、盐雾、焊接、年采购量和合作方式。"],
    ["02", "专家成果写入画像", "铝合金材料团队补充Al-Zn-Mg成分、工艺成熟度、专利和中试能力。"],
    ["03", "算法生成匹配结果", "系统按关键词、技术领域、区域协同和活跃度推荐材料专家。"],
    ["04", "科小果智能体洽谈", "需求方与专家方智能体自动追问成本、产能、质量责任和供应链。"]
  ];
  const [frame, setFrame] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialoguePlaying, setDialoguePlaying] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setFrame((value) => (value + 1) % frames.length), 1800);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setEventIndex((value) => (value + 1) % liveEvents.length), 1400);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setCaseIndex((value) => (value + 1) % matchCases.length), 2200);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!dialoguePlaying) return;
    const timer = setInterval(() => {
      setDialogueIndex((value) => {
        if (value >= dealDialogue.length - 1) {
          setDialoguePlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 1350);
    return () => clearInterval(timer);
  }, [dialoguePlaying]);
  return React.createElement("section", { className: "panel" },
    React.createElement("div", { className: "panel-header" },
      React.createElement("div", null, React.createElement("h2", null, "实时对接演示大厅"), React.createElement("span", { className: "eyebrow" }, "模拟平台真正运行时，供需双方和多智能体如何持续协作")),
      React.createElement("button", { className: playing ? "ghost" : "primary", onClick: () => setPlaying(!playing) }, playing ? "暂停" : "播放")
    ),
    React.createElement("div", { className: "live-demo-hall live-command-center" },
      React.createElement("section", { className: "match-radar-panel" },
        React.createElement("h3", null, "实时撮合雷达"),
        React.createElement("div", { className: "radar-stage" },
          React.createElement("div", { className: "radar-core" }, `${matchCases[caseIndex][3]}%`),
          ["企业需求", "专家成果", "经理人", "政策基金"].map((node, index) => React.createElement("span", { className: `radar-node n${index + 1}`, key: node }, node))
        ),
        React.createElement("div", { className: "match-case-list" }, matchCases.map((item, index) =>
          React.createElement("button", { className: index === caseIndex ? "active" : "", key: item[0], onClick: () => setCaseIndex(index) },
            React.createElement("b", null, item[0]),
            React.createElement("span", null, `${item[1]} · ${item[2]} · ${item[4]}`)
          )
        ))
      ),
      React.createElement("section", { className: "live-chat-panel" },
        React.createElement("h3", null, "供需双方实时洽谈"),
        React.createElement("div", { className: "mini-chat-stream" },
          dealDialogue.slice(Math.max(0, dialogueIndex - 5), dialogueIndex + 1).map((msg, index) =>
            React.createElement("div", { className: `talk-bubble ${msg[0]}`, key: `${dialogueIndex}-${index}` },
              React.createElement("span", null, msg[0] === "demand-side" ? "需求方智能体" : msg[0] === "expert-side" ? "专家方智能体" : "平台撮合官"),
              React.createElement("p", null, msg[1])
            )
          )
        ),
        React.createElement("div", { className: "hero-actions" },
          React.createElement("button", { className: "ghost", onClick: () => setDialogueIndex(0) }, "重置对话"),
          React.createElement("button", { className: "primary", onClick: () => setDialoguePlaying(!dialoguePlaying) }, dialoguePlaying ? "暂停自动洽谈" : "自动推进洽谈")
        )
      ),
      React.createElement("section", { className: "agent-collab-panel" },
        React.createElement("h3", null, "多智能体协作"),
        agentCollab.map((item, index) =>
          React.createElement("div", { className: index === eventIndex % agentCollab.length ? "agent-collab-item active" : "agent-collab-item", key: item[0] },
            React.createElement("b", null, item[0]),
            React.createElement("span", null, item[1])
          )
        ),
        React.createElement("div", { className: "live-feed compact-feed" },
          liveEvents.slice(0, 4).map((event, index) =>
            React.createElement("div", { className: index === eventIndex % 4 ? "feed-item active" : "feed-item", key: `${event[0]}-${event[1]}` },
              React.createElement("time", null, event[0]),
              React.createElement("b", null, event[1]),
              React.createElement("span", null, event[2])
            )
          )
        )
      )
    ),
    React.createElement("section", { className: "deal-room" },
      React.createElement("div", { className: "panel-header" },
        React.createElement("div", null,
          React.createElement("h2", null, "一对一对接室"),
          React.createElement("span", { className: "eyebrow" }, "从需求方开场到专家回应、风险追问、合作结论，逐句模拟真实洽谈")
        ),
        React.createElement("div", { className: "hero-actions" },
          React.createElement("button", { className: "ghost", onClick: () => { setDialogueIndex(0); setDialoguePlaying(false); } }, "重置"),
          React.createElement("button", { className: "primary", onClick: () => setDialoguePlaying(!dialoguePlaying) }, dialoguePlaying ? "暂停洽谈" : "播放完整洽谈")
        )
      ),
      React.createElement("div", { className: "deal-room-body" },
        React.createElement("aside", { className: "deal-participants" },
          React.createElement("div", null, React.createElement("b", null, "需求方"), React.createElement("span", null, "长三角无人装备制造有限公司")),
          React.createElement("div", null, React.createElement("b", null, "专家方"), React.createElement("span", null, "科学院高强铝合金团队")),
          React.createElement("div", null, React.createElement("b", null, "平台方"), React.createElement("span", null, "科技成果转化撮合官"))
        ),
        React.createElement("div", { className: "one-on-one-chat" },
          dealDialogue.slice(0, dialogueIndex + 1).map((msg, index) =>
            React.createElement("div", { className: `talk-bubble ${msg[0]}`, key: index },
              React.createElement("span", null, msg[0] === "demand-side" ? "需求方" : msg[0] === "expert-side" ? "专家方" : "平台撮合官"),
              React.createElement("p", null, msg[1])
            )
          )
        ),
        React.createElement("aside", { className: "deal-summary" },
          React.createElement("h3", null, "对接进度"),
          ["需求陈述", "指标确认", "成熟度追问", "成本谈判", "责任边界", "样件验证", "形成纪要"].map((step, index) =>
            React.createElement("div", { className: index <= Math.floor(dialogueIndex / 2) ? "summary-step done" : "summary-step", key: step }, step)
          )
        )
      )
    ),
    React.createElement("div", { className: "ai-demo-console" },
      React.createElement("div", { className: "console-stream" },
        frames.map((item, index) =>
          React.createElement("button", { key: item[0], className: index === frame ? "stream-card active" : "stream-card", onClick: () => setFrame(index) },
            React.createElement("b", null, item[0]),
            React.createElement("span", null, item[1]),
            React.createElement("small", null, item[2])
          )
        )
      ),
      React.createElement("div", { className: "console-visual" },
        React.createElement("div", { className: "jelly-hub" },
          React.createElement("strong", null, frames[frame][0]),
          React.createElement("span", null, frames[frame][1])
        ),
        ["需求画像", "成果画像", "专家库", "经理人", "政策基金", "智能纪要"].map((item, index) =>
          React.createElement("i", { className: `hub-dot d${index + 1}`, key: item }, item)
        )
      ),
      React.createElement("div", { className: "console-insight" },
        React.createElement("span", { className: "eyebrow" }, "AI 推理结果"),
        React.createElement("h3", null, "不是播放视频，而是模拟平台实时运行"),
        React.createElement("p", null, "系统把需求表单、专家成果、技术经理人和政策基金同时纳入撮合链路，逐步生成对接纪要和下一步任务。"),
        ["生成需求标准单", "推荐专家与经理人", "启动智能体预沟通", "输出验证与合同清单"].map((item, index) =>
          React.createElement("div", { className: index <= frame ? "insight-line done" : "insight-line", key: item }, item)
        )
      )
    ),
    React.createElement("div", { className: "scenario-grid" },
      React.createElement("section", { className: "scenario-card form-preview" },
        React.createElement("h3", null, "需求库填写演示"),
        demoField("需求名称", "无人装备高强耐蚀轻量化铝合金材料"),
        demoField("所属单位或公司名称", "长三角无人装备制造有限公司"),
        demoField("技术领域", "新材料"),
        demoField("技术指标", "抗拉强度≥450MPa；屈服强度≥380MPa；盐雾试验1000小时无明显腐蚀；支持MIG/TIG焊接"),
        demoField("拟解决的技术难题", "7075材料近海腐蚀维护成本高，焊接热影响区强度衰减明显，需要高强韧、轻量化、可批量供应材料"),
        demoField("预算金额", "1200万元 / 年采购约200吨")
      ),
      React.createElement("section", { className: "scenario-card expert-preview" },
        React.createElement("h3", null, "专家成果画像"),
        React.createElement("div", { className: "expert-head" },
          React.createElement("span", { className: "avatar" }, "顾"),
          React.createElement("div", null, React.createElement("b", null, "顾承铝"), React.createElement("span", { className: "eyebrow" }, "材料首席科学家"))
        ),
        React.createElement("p", null, "科学院高新技术研究中心"),
        React.createElement("div", { className: "meta" },
          React.createElement("span", { className: "tag" }, "Al-Zn-Mg"),
          React.createElement("span", { className: "tag" }, "动态冲击"),
          React.createElement("span", { className: "tag accent" }, "匹配度 96%")
        ),
        React.createElement("p", null, "具备高强铝合金成分设计、过渡族元素协同强化、中试生产和焊接工艺优化经验。")
      ),
      React.createElement("section", { className: "scenario-card chat-preview" },
        React.createElement("h3", null, "对接完成后输出"),
        ["样件试制任务单", "盐雾/疲劳/焊接验证计划", "质量责任条款建议", "长期供应协议要点", "政策与基金匹配清单"].map((item) =>
          React.createElement("div", { className: "output-line", key: item }, item)
        )
      )
    )
  );
}

function demoField(label, value) {
  return React.createElement("div", { className: "demo-field" }, React.createElement("b", null, label), React.createElement("span", null, value));
}

function MatchLogic() {
  const steps = [
    ["01", "文本建模", "系统将需求名称、技术指标、难题描述、现有基础和关键词组合成需求画像，同时把专家领域、关键词、履历形成专家画像。"],
    ["02", "TF-IDF思路", "原型中使用词频向量模拟TF-IDF流程，计算需求与专家画像的余弦相似度，后续可替换为分词、IDF语料库和向量数据库。"],
    ["03", "领域与区域加权", "同领域专家获得较高权重；、上海、江苏、浙江、安徽等区域协作场景会增加推荐分。"],
    ["04", "记录与优化", "每次匹配和会话都会留存在数据层，为后续引入反馈评分、成交结果和模型调优提供样本。"]
  ];
  return React.createElement("section", { className: "panel" },
    React.createElement("h2", null, "匹配逻辑说明"),
    React.createElement("div", { className: "logic" }, steps.map(([no, title, text]) =>
      React.createElement("div", { className: "logic-step", key: no },
        React.createElement("b", null, no),
        React.createElement("div", null, React.createElement("h3", null, title), React.createElement("p", null, text))
      )
    ))
  );
}

function field(label, input, className = "") {
  return React.createElement("div", { className: `field ${className}` }, React.createElement("label", null, label), input);
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
