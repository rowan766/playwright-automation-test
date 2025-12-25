import { test, expect } from '@playwright/test';

test.describe('示例测试套件', () => {
  test('百度搜索测试', async ({ page }) => {
    // 访问百度
    await page.goto('https://www.baidu.com');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/百度/);
    
    // 输入搜索关键词
    await page.fill('#kw', 'Playwright');
    
    // 点击搜索按钮
    await page.click('#su');
    
    // 等待搜索结果
    await page.waitForSelector('#content_left');
    
    // 验证搜索结果存在
    const results = await page.locator('#content_left .result').count();
    expect(results).toBeGreaterThan(0);
    
    console.log(`✅ 找到 ${results} 条搜索结果`);
  });

  test('GitHub 首页访问测试', async ({ page }) => {
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);
    
    // 验证导航栏存在
    const nav = page.locator('header');
    await expect(nav).toBeVisible();
  });
});
