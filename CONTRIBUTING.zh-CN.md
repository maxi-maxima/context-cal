# 贡献指南

感谢你帮助改进 `context-cal`。

## 开发

```bash
npm install
npm run check
```

## 本地演示

```bash
npm run dev -- demo --out reports/demo
```

## 规则贡献

好的规则应该具备这些特征：

- 确定性
- 本地优先
- 能用一句话解释
- 与上下文预算或可维护性直接相关
- 有 fixture 或单元测试支撑

请避免提交需要实时模型调用、私有遥测，或从无关源码里猜测开发者意图的规则。

## Pull Request

提交 PR 前请运行：

```bash
npm run check
node dist/cli.js demo --out reports/demo
```

请在 PR 里简要说明用户可见行为，以及是否修改了规则。
