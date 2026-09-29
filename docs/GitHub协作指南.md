# GitHub 协作指南

## 适合 GitHub 管理的内容

- 源代码
- 功能需求
- Bug
- 版本记录
- Pull Request 审核
- 发布版本

## 推荐仓库设置

仓库名建议：

```text
tech-transfer-platform
```

仓库描述建议：

```text
科技成果转化平台：成果库、需求库、专家库、智能体广场和供需对接演示系统。
```

建议先设为 Private，等演示版本成熟后再决定是否公开。

## 邀请协作者

领导提供的邮箱：

```text
LawSchool.Tsinghua@gmail.com
```

GitHub 邀请时可能需要对方 GitHub 用户名；如果该邮箱已绑定 GitHub，也可以尝试用邮箱邀请。

路径：

```text
Repository -> Settings -> Collaborators and teams -> Add people
```

## 分支策略

| 分支 | 用途 |
| --- | --- |
| main | 稳定演示版本 |
| codex/site-polish | 页面真实网站化 |
| codex/agent-square | 智能体广场和模型接入 |
| codex/data-model | 数据库字段和真实样例数据 |

## 提交规范

建议提交信息格式：

```text
feat: add one-on-one negotiation room
fix: correct demand matching display
docs: add co-work plan
```

## Pull Request 审核重点

- 页面是否像真实平台
- 对接流程是否符合业务逻辑
- 智能体回答是否可信
- 数据字段是否完整
- 演示路径是否顺畅

## 首批 Issues 建议

1. 首页改造成真实科技市场门户
2. 成果详情页参考真实平台字段
3. 需求库增加标准化需求单
4. 专家库增加专家画像和响应状态
5. 智能体广场接入真实大模型
6. 一对一对接室完整演示从开场到纪要
7. 增加政策、专利、投融资协同智能体
