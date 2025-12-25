# Playwright 自动化测试项目

这是一个使用 Playwright 进行端到端自动化测试的示例项目。

## 🚀 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/rowan766/playwright-automation-test.git
cd playwright-automation-test
```

### 2. 安装依赖
```bash
npm install
npx playwright install
```

### 3. 运行测试
```bash
# 运行所有测试
npm test

# 有头模式运行
npm run test:headed

# 调试模式
npm run test:debug

# UI 模式
npm run test:ui
```

### 4. 查看测试报告
```bash
npm run report
```

## 📁 项目结构

```
playwright-automation-test/
├── tests/                    # 测试文件目录
│   ├── example.spec.ts      # 基础示例测试
│   └── form.spec.ts         # 表单交互测试
├── screenshots/             # 截图保存目录
├── playwright.config.ts     # Playwright 配置
├── package.json
└── README.md
```

## 🧪 测试用例说明

### example.spec.ts
- ✅ 百度搜索功能测试
- ✅ GitHub 首页访问测试

### form.spec.ts
- ✅ 表单填写与提交测试
- ✅ 各种输入控件交互测试

## 🛠️ 常用命令

```bash
# 录制测试代码
npm run codegen https://example.com

# 运行特定测试文件
npx playwright test example.spec.ts

# 只运行 Chromium 浏览器测试
npx playwright test --project=chromium

# 运行失败的测试
npx playwright test --last-failed
```

## 📝 学习资源

- [Playwright 官方文档](https://playwright.dev)
- [Playwright API 文档](https://playwright.dev/docs/api/class-playwright)
- [最佳实践指南](https://playwright.dev/docs/best-practices)

## 👨‍💻 作者

Purplegrape Reed - 前端开发者 & 团队 Leader

## 📄 License

MIT
