# 内容填充任务分拆

## 任务目标
- 每个 tab 下保证 20 条内容
- 来源：网络抓取 + 自己生成 + 原文填充

## 任务分拆

### C1: 首页 6 个 Tab 内容填充 (预计：3-4 小时)
- **Tabs**: All, Reports, Alpha Insights, Notes, Media, Reads
- **每 Tab 内容**: 20 条
- **总计**: 120 条内容
- **来源**: 
  - 网络抓取 delphidigital.io
  - 基于抓取内容生成变体
  - OKX 教程文章迁移

### C2: Research 页面内容填充 (预计：2-3 小时)
- **分类**: 全部分类、金融、基础设施、DeFi、NFT
- **每分类内容**: 20 条
- **总计**: 100 条内容

### C3: Library 页面内容填充 (预计：2-3 小时)
- **分类**: Finance, Infrastructure, DeFi, NFT, Gaming 等
- **每分类内容**: 20 条

### C4: Tools/Projects 页面内容填充 (预计：2-3 小时)
- **项目数量**: 20-30 个项目
- **每个项目**: 描述、工具、数据

### C5: Data Apps 内容填充 (预计：2-3 小时)
- Sector Performance Dashboard 数据
- BTC Game Theory Tool 数据

## 执行规则
1. 先抓取原站内容作为样本
2. 基于样本生成变体内容
3. 保证内容质量和多样性
4. 所有数据写入 data/content.json

---
**任务创建时间**: 2026-02-26 15:10 UTC
