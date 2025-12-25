import { test, expect } from '@playwright/test';
import { getCaptchaFromPage } from '../utils/captcha';

// 配置忽略 HTTPS 证书错误
test.use({
  ignoreHTTPSErrors: true
});

const BASE_URL = 'https://192.168.1.177/glyh/#/';
const TEST_USER = {
  username: 'sheng01',
  password: 'sheng01@123456'
};

// 验证码图片选择器 - 根据 DOM 结构确定
const CAPTCHA_SELECTOR = '.el-image__inner'; // 或 'img[src^="data:image/png"]'

test.describe('公路养护系统测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('登录功能测试-自动识别验证码', async ({ page }) => {
    await loginWithOCR(page);
    
    // 验证登录成功
    await page.waitForLoadState('networkidle');
    await expect(page.locator('canvas')).toBeVisible();
    
    console.log('✅ 登录成功');
  });

  test('地图图例交互测试', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('button', { name: ' 图例' }).click();
    await page.locator('span').filter({ hasText: /^省道$/ }).click();
    await page.locator('span').filter({ hasText: '国道' }).click();
    await expect(page.locator('canvas')).toBeVisible();
    
    console.log('✅ 地图图例交互成功');
  });

  test('资产管理-路线信息查看', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    await page.getByText('路线信息').click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 路线信息页面加载成功');
  });

  test('桥梁管理-查看详情', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    await page.getByText('桥梁管理').click();
    await page.waitForSelector('.el-table__body');
    
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.view-btn-action').click();
    
    await expect(page.getByRole('button', { name: '返回上一级' })).toBeVisible();
    await page.getByRole('button', { name: '返回上一级' }).click();
    
    console.log('✅ 桥梁详情查看成功');
  });

  test('隧道管理-查看和操作', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    await page.getByText('隧道管理').click();
    await page.waitForSelector('.el-table__body');
    
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.view-btn-action').click();
    
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.cell > span').first().click();
    
    await page.getByRole('button', { name: 'Close' }).click();
    
    console.log('✅ 隧道管理操作成功');
  });

  test('附属设施管理-菜单导航', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menuitem', { name: '附属设施管理' }).click();
    await page.getByText('交安设施').click();
    await page.waitForLoadState('networkidle');
    
    await page.getByText('交调站管理').click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 附属设施菜单导航成功');
  });

  test('巡查养护-完整流程', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menubar').locator('div').filter({ hasText: '巡查养护' }).click();
    await page.getByText('路面巡查').click();
    await page.waitForLoadState('networkidle');
    
    await page.getByText('资产纠错').click();
    await page.waitForLoadState('networkidle');
    
    await page.getByText('病害一张图').click();
    await page.getByRole('textbox', { name: '请选择月份' }).first().click();
    await page.getByText('一月', { exact: true }).click();
    
    console.log('✅ 巡查养护流程测试成功');
  });

  test('桥梁巡查-检查类型切换', async ({ page }) => {
    await loginWithOCR(page);
    
    await page.getByRole('menubar').locator('div').filter({ hasText: '巡查养护' }).click();
    await page.getByText('桥梁巡查').click();
    
    await page.getByText('日常巡查', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    
    await page.getByText('经常性检查').click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 桥梁巡查检查类型切换成功');
  });
});

// 自动识别验证码登录(带重试机制)
async function loginWithOCR(page, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔐 第 ${attempt} 次登录尝试...`);
      
      // 填写用户名密码
      await page.getByRole('textbox', { name: '账户名' }).fill(TEST_USER.username);
      await page.getByRole('textbox', { name: '密码' }).fill(TEST_USER.password);
      
      // 获取并识别验证码
      console.log('🔍 正在识别验证码...');
      const captchaCode = await getCaptchaFromPage(page, CAPTCHA_SELECTOR);
      
      console.log(`✍️  填写验证码: ${captchaCode}`);
      await page.getByRole('textbox', { name: '请输入验证码' }).fill(captchaCode);
      
      // 点击登录
      await page.getByRole('button', { name: '登录' }).click();
      
      // 等待登录结果
      await page.waitForTimeout(2000);
      
      // 检查是否登录成功(判断是否跳转或出现错误提示)
      const isLoginPage = await page.locator('.desktop-login').isVisible().catch(() => false);
      
      if (!isLoginPage) {
        // 已经离开登录页,说明登录成功
        await page.waitForLoadState('networkidle');
        console.log('✅ 登录成功');
        return;
      }
      
      // 还在登录页,可能是验证码错误
      console.log(`❌ 第 ${attempt} 次尝试失败,验证码可能识别错误`);
      
      if (attempt < maxRetries) {
        // 刷新页面重试
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
      
    } catch (error) {
      console.error(`❌ 第 ${attempt} 次尝试出错:`, error.message);
      
      if (attempt === maxRetries) {
        console.log('⏸️  OCR 识别失败次数过多,请手动输入验证码');
        await page.pause();
        return;
      }
    }
  }
}
