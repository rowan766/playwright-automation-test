# Playwright 自动化测试项目

这是一个使用 Playwright 进行端到端自动化测试的项目,支持 OCR 验证码自动识别。

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

---

## 📁 项目结构

```
playwright-automation-test/
├── tests/                    # 测试文件目录
│   ├── example.spec.ts      # 基础示例测试
│   ├── form.spec.ts         # 表单交互测试
│   └── glyh-system.spec.ts  # 公路养护系统测试(OCR验证码)
├── utils/                    # 工具函数
│   └── captcha.ts           # OCR 验证码识别
├── screenshots/             # 截图保存目录
├── playwright.config.ts     # Playwright 配置
├── package.json
└── README.md
```

---

## 🧪 测试用例说明

### example.spec.ts
- ✅ Playwright 官网访问测试
- ✅ GitHub 首页访问测试
- ✅ 表单网站访问测试

### form.spec.ts
- ✅ 表单填写与提交测试
- ✅ 各种输入控件交互测试

### glyh-system.spec.ts (公路养护系统)
- ✅ 登录功能测试(OCR 自动识别验证码)
- ✅ 地图图例交互测试
- ✅ 资产管理-路线信息查看
- ✅ 桥梁管理-查看详情
- ✅ 隧道管理-查看和操作
- ✅ 附属设施管理-菜单导航
- ✅ 巡查养护-完整流程
- ✅ 桥梁巡查-检查类型切换

---

## 🔐 OCR 验证码识别

本项目集成了 Tesseract.js OCR 引擎,可自动识别登录验证码。

### 特性
- ✅ 自动截取验证码图片
- ✅ 图片预处理(灰度化、二值化、增强对比度)
- ✅ OCR 识别并去除空格
- ✅ 识别失败自动重试(最多 3 次)
- ✅ 识别失败后可手动输入

### 调试模式
```bash
# 开启调试模式,保存验证码图片
DEBUG_CAPTCHA=true npx playwright test glyh-system.spec.ts -g "登录" --headed
```

会生成两个调试文件:
- `captcha-original.png` - 原始验证码图片
- `captcha-processed.png` - 预处理后的图片

---

## 🛠️ 常用命令

```bash
# 录制测试代码
npm run codegen https://example.com

# 运行特定测试文件
npx playwright test example.spec.ts

# 运行特定测试用例
npx playwright test -g "登录功能"

# 只运行 Chromium 浏览器测试
npx playwright test --project=chromium

# 运行失败的测试
npx playwright test --last-failed

# 调试特定测试
npx playwright test glyh-system.spec.ts --debug
```

---

## ⚙️ 配置说明

### playwright.config.ts
- `testDir`: 测试文件目录
- `timeout`: 测试超时时间(30秒)
- `retries`: 失败重试次数(2次)
- `workers`: 并行执行数(3个)
- `projects`: 多浏览器配置(Chromium/Firefox/WebKit/Mobile)

### 环境变量
- `DEBUG_CAPTCHA=true`: 开启验证码调试模式,保存图片

---

## 📝 编写测试技巧

### 1. 使用语义化选择器
```typescript
// ✅ 推荐
await page.getByRole('button', { name: '登录' });
await page.getByText('欢迎');

// ❌ 避免
await page.locator('div'); // 太宽泛
```

### 2. 等待策略
```typescript
// 等待网络空闲
await page.waitForLoadState('networkidle');

// 等待元素出现
await page.waitForSelector('.data-loaded');

// 等待 API 响应
await page.waitForResponse(resp => resp.url().includes('/api/data'));
```

### 3. 截图和录屏
配置文件中已开启:
- 失败时自动截图
- 失败时自动录屏
- 首次重试时记录 trace

---

## 🔧 常见问题

### Q: 验证码识别失败?
A: 
1. 检查控制台输出的识别结果
2. 开启 `DEBUG_CAPTCHA=true` 查看图片
3. 调整 `utils/captcha.ts` 中的预处理参数
4. 联系后端关闭验证码或使用固定验证码

### Q: HTTPS 证书错误?
A: 已配置 `ignoreHTTPSErrors: true`,内网系统无需担心

### Q: 测试很慢?
A: 调整 `playwright.config.ts` 中的 `workers` 参数增加并发

### Q: 选择器找不到元素?
A: 使用 `npx playwright codegen` 录制准确的选择器

---

## 📚 学习资源

- [Playwright 官方文档](https://playwright.dev)
- [Playwright API 文档](https://playwright.dev/docs/api/class-playwright)
- [最佳实践指南](https://playwright.dev/docs/best-practices)
- [Tesseract.js 文档](https://tesseract.projectnaptha.com/)

---

## 👨‍💻 作者

Purplegrape Reed - 前端开发者 & 团队 Leader

---

## 📄 License

MIT
