import { test, expect } from '@playwright/test';

test.describe('示例测试套件', () => {
  test('Playwright 官网访问测试', async ({ page }) => {
    // 访问 Playwright 官网
    await page.goto('https://playwright.dev');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/Playwright/);
    
    // 验证主标题可见
    const heading = page.getByRole('heading', { name: /Playwright enables/i });
    await expect(heading).toBeVisible();
    
    console.log('✅ Playwright 官网访问成功');
  });

  test('GitHub 首页访问测试', async ({ page }) => {
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    // 修复: 使用更精确的选择器,只选择顶部导航栏
    const nav = page.locator('header[role="banner"]').first();
    await expect(nav).toBeVisible();
    
    console.log('✅ GitHub 首页访问成功');
  });

  test('表单网站访问测试', async ({ page }) => {
    await page.goto('https://www.selenium.dev/selenium/web/web-form.html');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/Web form/);
    
    // 验证表单元素存在
    await expect(page.locator('#my-text-id')).toBeVisible();
    
    console.log('✅ 表单页面加载成功');
  });
});
