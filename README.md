# 科技成果转化平台

> **项目标识：通用版**
>
> 本仓库只用于科技成果转化平台。后续“大连科技成果转化平台”应使用独立仓库、独立数据目录和独立部署配置，禁止将两个地区的数据与代码直接混放。

这是一个可运行的全栈原型，覆盖专家库、企业需求库、成果库、智能匹配、实时对话、活跃度仪表盘和匹配逻辑说明。

## 项目交接

- 给其他大模型或开发人员继续修改前，请先阅读 [`项目交接说明.md`](项目交接说明.md)。
- 当前业务数据位于 `data/`。
- 修改虚拟展示总量之前的真实数据备份位于 `backups/real-data-before-virtual-totals-20260723-1151/`。
- 本项目为通用版，请勿改作特定地区的版本继续叠加数据。

## 技术栈

- 前端：React 18（CDN UMD）+ 原生 CSS
- 后端：Node.js 原生 HTTP 服务
- 实时通信：原生 WebSocket 握手与消息帧
- 演示数据层：`data/store.json`
- 生产数据库设计：见 `schema.sql`，可迁移到 MySQL；也可按同字段映射到 MongoDB collections

## 启动

```bash
npm start
```

当前环境没有全局 `node/npm` 时，也可以直接运行：

```bash
/Users/macbookpro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js
```

打开：

```text
http://localhost:3000
```

演示账号：

- 企业用户：`13800000001` / `demo123`
- 专家用户：`13800000002` / `demo123`

## 测试

```bash
npm test
```

或：

```bash
/Users/macbookpro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/matcher.test.js
```

## 已实现模块

- 用户注册与登录
- 企业需求发布
- 成果库浏览与筛选
- 专家库匹配推荐，展示 3-5 位专家、匹配度和推荐理由
- 智能体广场会话，WebSocket 实时消息与智能体反馈
- 匹配记录、会话记录、聊天记录持久化
- 活跃度指标仪表盘
- 匹配逻辑说明页

## 后续上线建议

- 将 `data/store.json` 替换为 MySQL，使用 `schema.sql` 建表
- 登录密码改为 bcrypt 哈希，增加 JWT/Session 权限校验
- 使用中文分词、TF-IDF IDF 语料、向量数据库或 embedding 模型提升匹配效果
- 增加专家端响应、评价、成交状态和项目跟踪流程
- 使用 Nginx + HTTPS + PM2 或 Docker Compose 部署

## 共同编辑

`localhost:3000` 只能本机访问。若要和领导共同编辑，建议使用 GitHub 私有仓库 + GitHub Codespaces。

详见：[docs/共同编辑网站方案.md](docs/共同编辑网站方案.md)
