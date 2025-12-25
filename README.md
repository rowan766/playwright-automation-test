# Playwright 自动化测试项目

这是一个使用 Playwright 进行端到端自动化测试的项目,支持 OCR 验证码自动识别。

---

## 📦 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/rowan766/playwright-automation-test.git
cd playwright-automation-test
```

### 2. 安装依赖
```bash
# 安装 Node.js 依赖
npm install

# 安装 Playwright 浏览器
npx playwright install

# 安装 OCR 识别依赖
npm install tesseract.js sharp
```

### 3. 快速测试
```bash
# 运行示例测试
npm test
```

---

## 🚀 常用命令速查

### 基础测试命令

```bash
# 运行所有测试(无头模式,看不到浏览器)
npm test

# 运行所有测试(有头模式,能看到浏览器操作)
npm run test:headed

# 调试模式(逐步执行,可暂停)
npm run test:debug

# UI 模式(图形界面,最直观)
npm run test:ui
```

### 运行特定测试文件

```bash
# 运行公路养护系统测试
npx playwright test glyh-system.spec.ts

# 运行示例测试
npx playwright test example.spec.ts

# 运行表单测试
npx playwright test form.spec.ts
```

### 运行特定测试用例

```bash
# 只运行登录测试
npx playwright test glyh-system.spec.ts -g "登录"

# 只运行桥梁管理测试
npx playwright test glyh-system.spec.ts -g "桥梁"

# 只运行地图相关测试
npx playwright test glyh-system.spec.ts -g "地图"

# 只运行巡查养护测试
npx playwright test glyh-system.spec.ts -g "巡查"
```

### 录制测试用例

```bash
# 录制新的测试用例
npm run codegen

# 录制特定网站的测试
npx playwright codegen https://example.com

# 录制内网 HTTPS 网站(忽略证书错误)
npx playwright codegen https://192.168.1.177/glyh/ --ignore-https-errors

# 录制时指定浏览器
npx playwright codegen --browser=chromium

# 录制时指定设备(如手机)
npx playwright codegen --device="iPhone 13"
```

### 调试命令

```bash
# 有头模式(能看到浏览器)
npx playwright test --headed

# 慢速执行(每步延迟 1 秒)
npx playwright test --headed --slow-mo=1000

# 调试特定测试
npx playwright test glyh-system.spec.ts --debug

# UI 模式(图形界面调试)
npx playwright test --ui

# 只运行上次失败的测试
npx playwright test --last-failed
```

### 查看测试报告

```bash
# 查看 HTML 测试报告
npm run report

# 或者
npx playwright show-report

# 查看特定测试的 Trace 文件(时光机回放)
npx playwright show-trace test-results/xxx/trace.zip
```

### OCR 验证码调试

```bash
# 开启验证码调试模式(保存验证码图片)
DEBUG_CAPTCHA=true npx playwright test glyh-system.spec.ts -g "登录" --headed

# Windows PowerShell
$env:DEBUG_CAPTCHA="true"; npx playwright test glyh-system.spec.ts -g "登录" --headed

# Windows CMD
set DEBUG_CAPTCHA=true && npx playwright test glyh-system.spec.ts -g "登录" --headed
```

---

## 📁 项目结构

```
playwright-automation-test/
├── tests/                          # 测试文件目录
│   ├── example.spec.ts            # 基础示例测试
│   ├── form.spec.ts               # 表单交互测试
│   └── glyh-system.spec.ts        # 公路养护系统测试(OCR验证码)
├── utils/                          # 工具函数
│   └── captcha.ts                 # OCR 验证码识别工具
├── test-results/                   # 测试结果(失败时的截图/录屏)
├── playwright-report/              # HTML 测试报告
├── screenshots/                    # 截图保存目录
├── playwright.config.ts            # Playwright 配置文件
├── package.json                   # 项目依赖配置
└── README.md                      # 项目说明文档
```

---

## 🧪 测试用例说明

### example.spec.ts - 基础示例
- ✅ Playwright 官网访问测试
- ✅ GitHub 首页访问测试
- ✅ 表单网站访问测试

### form.spec.ts - 表单交互
- ✅ 表单填写与提交测试
- ✅ 各种输入控件交互测试

### glyh-system.spec.ts - 公路养护系统(完整业务测试)
- ✅ 登录功能测试(OCR 自动识别验证码)
- ✅ 地图图例交互测试
- ✅ 资产管理 - 路线信息查看
- ✅ 桥梁管理 - 查看详情
- ✅ 隧道管理 - 查看和操作
- ✅ 附属设施管理 - 菜单导航
- ✅ 巡查养护 - 完整流程
- ✅ 桥梁巡查 - 检查类型切换

---

## 🔐 OCR 验证码识别

本项目集成了 **Tesseract.js OCR 引擎**,可自动识别登录验证码。

### 特性
- ✅ 自动截取验证码图片
- ✅ 图片预处理(放大、灰度化、二值化、增强对比度)
- ✅ 双模式 OCR 识别(SINGLE_LINE + SINGLE_WORD)
- ✅ 自动去除空格和特殊字符
- ✅ 识别失败自动重试(最多 3 次)
- ✅ 识别失败后支持手动输入

### 识别率
- 当前识别率:**约 70-80%**
- 配合 3 次重试机制,总成功率:**约 95%+**

### 调试验证码识别
```bash
# 开启调试模式,保存验证码图片
DEBUG_CAPTCHA=true npx playwright test glyh-system.spec.ts -g "登录" --headed
```

会生成两个调试文件:
- `captcha-original.png` - 原始验证码截图
- `captcha-processed.png` - 预处理后的图片

### 优化识别率
如果识别率不理想,可以:
1. 查看调试图片,调整 `utils/captcha.ts` 中的预处理参数
2. 调整二值化阈值:`threshold(120)` → `threshold(100)` 或 `threshold(140)`
3. 联系后端在测试环境使用固定验证码

---

## ⚙️ 配置说明

### playwright.config.ts 主要配置

```typescript
{
  testDir: './tests',           // 测试文件目录
  timeout: 30000,               // 单个测试超时时间(30秒)
  retries: 2,                   // 失败后重试次数(共执行 3 次)
  workers: 1,                   // 并行执行数(1 个浏览器)
  
  use: {
    viewport: { width: 1920, height: 1080 },  // 浏览器分辨率
    screenshot: 'only-on-failure',            // 失败时截图
    video: 'retain-on-failure',               // 失败时保留录屏
    trace: 'on-first-retry',                  // 第一次重试时记录 trace
  },
  
  projects: [
    { name: 'chromium' }        // 只使用 Chrome 浏览器
  ]
}
```

### 修改浏览器分辨率
编辑 `playwright.config.ts`:
```typescript
viewport: { width: 1920, height: 1080 }  // 改成你想要的分辨率
```

### 启用多浏览器测试
取消注释 `playwright.config.ts` 中的浏览器配置:
```typescript
projects: [
  { name: 'chromium' },
  { name: 'firefox' },    // 取消注释
  { name: 'webkit' },     // 取消注释
]
```

---

## 📝 编写测试技巧

### 1. 使用语义化选择器(推荐)
```typescript
// ✅ 推荐: 使用 role 和 text
await page.getByRole('button', { name: '登录' });
await page.getByText('欢迎');
await page.getByPlaceholder('请输入用户名');

// ❌ 避免: 使用通用选择器
await page.locator('div');  // 太宽泛,可能匹配多个元素
await page.locator('.btn'); // 容易因 class 变化而失效
```

### 2. 等待策略
```typescript
// 等待网络空闲(页面加载完成)
await page.waitForLoadState('networkidle');

// 等待元素出现
await page.waitForSelector('.data-loaded');

// 等待 API 响应
await page.waitForResponse(resp => resp.url().includes('/api/data'));

// 等待元素消失(如 loading)
await page.waitForSelector('.loading', { state: 'hidden' });
```

### 3. 断言
```typescript
// 验证元素可见
await expect(page.locator('.title')).toBeVisible();

// 验证文本内容
await expect(page.locator('.message')).toContainText('成功');

// 验证 URL
await expect(page).toHaveURL(/dashboard/);

// 验证页面标题
await expect(page).toHaveTitle(/首页/);
```

### 4. 截图和录屏
```typescript
// 页面截图
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// 元素截图
await page.locator('.logo').screenshot({ path: 'logo.png' });

// 生成 PDF
await page.pdf({ path: 'page.pdf', format: 'A4' });
```

---

## 🔧 常见问题

### Q: 测试运行很慢?
**A:** 调整并发数和超时时间
```typescript
// playwright.config.ts
workers: 3,      // 增加并发数(根据电脑性能调整)
timeout: 60000,  // 增加超时时间
```

### Q: 验证码识别失败?
**A:** 三种解决方案
1. 开启调试查看识别结果:
   ```bash
   DEBUG_CAPTCHA=true npx playwright test glyh-system.spec.ts -g "登录" --headed
   ```
2. 调整 `utils/captcha.ts` 中的预处理参数
3. 联系后端在测试环境关闭验证码或使用固定验证码

### Q: HTTPS 证书错误?
**A:** 已配置忽略证书错误
```typescript
test.use({
  ignoreHTTPSErrors: true  // 内网 HTTPS 无需担心
});
```

### Q: 选择器找不到元素?
**A:** 使用 codegen 录制准确的选择器
```bash
npx playwright codegen https://your-website.com
```

### Q: 测试失败后如何调试?
**A:** 三种方法
1. 查看 HTML 报告:
   ```bash
   npx playwright show-report
   ```
2. 查看失败时的截图和录屏(在 `test-results/` 目录)
3. 查看 Trace 文件(时光机回放):
   ```bash
   npx playwright show-trace test-results/xxx/trace.zip
   ```

### Q: 如何在 CI/CD 中运行?
**A:** 已包含 GitHub Actions 配置
- Push 代码自动触发测试
- 测试报告自动上传为 Artifacts
- 配置文件:`.github/workflows/test.yml`

---

## 📚 学习资源

- [Playwright 官方文档](https://playwright.dev)
- [Playwright API 参考](https://playwright.dev/docs/api/class-playwright)
- [最佳实践指南](https://playwright.dev/docs/best-practices)
- [Tesseract.js 文档](https://tesseract.projectnaptha.com/)
- [选择器完整文档](https://playwright.dev/docs/selectors)

---

## 🎯 实战示例

### 示例 1: 测试登录流程
```bash
# 录制登录流程
npx playwright codegen https://192.168.1.177/glyh/ --ignore-https-errors

# 运行登录测试(慢速,能看清楚)
npx playwright test glyh-system.spec.ts -g "登录" --headed --slow-mo=500

# 调试登录测试
npx playwright test glyh-system.spec.ts -g "登录" --debug
```

### 示例 2: 测试表单提交
```bash
# 录制表单操作
npx playwright codegen https://your-form-page.com

# 运行表单测试
npx playwright test form.spec.ts --headed
```

### 示例 3: 批量运行测试
```bash
# 运行所有测试并生成报告
npm test
npx playwright show-report

# 只运行某个模块的所有测试
npx playwright test glyh-system.spec.ts --headed
```

---

## 👨‍💻 项目维护

### 添加新的测试用例
1. 在 `tests/` 目录创建新的 `.spec.ts` 文件
2. 使用 `codegen` 录制基本操作
3. 优化和组织测试代码
4. 运行测试验证

### 更新依赖
```bash
# 更新 Playwright
npm update @playwright/test
npx playwright install

# 更新其他依赖
npm update
```

### 提交代码
```bash
git add .
git commit -m "feat: 添加 xxx 测试用例"
git push
```

---

## 📄 License

MIT

---

## 🙋 问题反馈

遇到问题?
1. 查看上面的"常见问题"
2. 查看测试报告和 Trace 文件
3. 在 GitHub 提 Issue

---

**Happy Testing! 🚀**
