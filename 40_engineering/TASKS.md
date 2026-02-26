# TASKS — delphi-pixel-perfect / 40_engineering

> 强制规则：接到任务后必须分拆为 2-4 小时的小任务，每个小任务独立验收标准、预计时间、产出物。

## TODO（可自驱推进）

- [x] **P2: Tools 模块技术框架** (完成时间：2026-02-26 14:15 UTC) (预计：2-3 小时)
  - **owner**: 小星
  - **model**: qwen3-coder-plus
  - **output**: `40_engineering/templates/pages/projects.html`, `40_engineering/scripts/pages/projects.js`
  - **verify**: 路由可访问 + 项目筛选占位 + 卡片网格占位 + 响应式正常
  - **目标**: `/projects` 页面技术框架实现

- [ ] **P3: 其他模块技术框架** (预计：3-4 小时)
  - **owner**: 小星
  - **model**: qwen3-coder-plus
  - **output**: `40_engineering/templates/pages/analysts.html`, `40_engineering/templates/pages/transparency.html`
  - **verify**: 路由可访问 + 基本页面结构完整 + 响应式正常
  - **目标**: Analysts、Transparency、Legal 页面技术框架

- [ ] **P4: 跨页面一致性验证** (预计：1-2 小时)
  - **owner**: 小星
  - **model**: kimi-k2.5
  - **output**: `runs/delphi-consistency-check-20260226/report.md`
  - **verify**: 一致性检查报告 + 问题修复 + 视觉测试通过
  - **目标**: 全站设计系统一致性检查与修复

- [ ] **P5: 性能优化与部署验证** (预计：2-3 小时)
  - **owner**: 小星
  - **model**: qwen3-coder-plus
  - **output**: `runs/delphi-performance-report-20260226/lighthouse.json`
  - **verify**: Lighthouse 90+ + 核心 Web 指标达标 + 部署稳定
  - **目标**: Lighthouse 评分 90+，加载性能优化

- [ ] **P6: 内容详情标准化迁移** (预计：2-3 小时)
  - **owner**: 小星
  - **model**: qwen3-coder-plus
  - **output**: `40_engineering/templates/pages/article.html`
  - **verify**: URL 兼容 + 面包屑导航 + 代码高亮
  - **目标**: `/article?slug=` → `/reports/:slug` 格式迁移

## DONE（必须带产出路径）

- [x] 2026-02-26 P1: Library 模块技术框架 → `40_engineering/templates/pages/explore.html`, `40_engineering/scripts/pages/explore.js`
- [x] 2026-02-26 核心架构完善 → `40_engineering/scripts/`, `40_engineering/templates/`, `40_engineering/styles/`
- [x] 2026-02-26 侧边导航 6 页面 → `40_engineering/templates/pages/{home,search,explore,bookmarks,projects,help}.html`
- [x] 2026-02-26 Data Apps 模块空页面框架 → `40_engineering/templates/pages/{sector-performance,btc-game-theory}.html`
- [x] 2026-02-26 用户指令执行 (list 布局+SPA 导航) → `40_engineering/templates/pages/home.html`, `40_engineering/templates/base.html`
- [x] 2026-02-26 项目结构迁移 → `business/delphi-pixel-perfect/` (v3.2 阶段目录)

## 迁移记录

- **迁移时间**: 2026-02-26 13:55 UTC
- **迁移 Run**: `runs/migration-20260226-1320/`
- **阶段目录**: 00_brief, 10_research, 20_decisions, 30_product, 40_engineering, 50_growth, 60_qa, 90_postmortem
- **配置文件**: _headers, _redirects, wrangler.toml, package.json (保留根目录)
