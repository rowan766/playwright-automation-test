import { test, expect } from '@playwright/test';

test.describe('表单交互测试', () => {
  test('表单填写与提交', async ({ page }) => {
    // 使用公开的测试表单网站
    await page.goto('https://www.selenium.dev/selenium/web/web-form.html');
    
    // 填写文本输入框
    await page.fill('#my-text-id', 'Playwright Test');
    
    // 填写密码
    await page.fill('input[name="my-password"]', 'Test123456');
    
    // 填写文本域
    await page.fill('textarea', '这是自动化测试填写的内容');
    
    // 选择下拉框
    await page.selectOption('select[name="my-select"]', '2');
    
    // 点击提交按钮
    await page.click('button[type="submit"]');
    
    // 验证提交成功
    await expect(page.locator('#message')).toBeVisible();
  });
});
