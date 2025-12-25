import { test, expect } from '@playwright/test';

// 配置忽略 HTTPS 证书错误
test.use({
  ignoreHTTPSErrors: true
});

const BASE_URL = 'https://192.168.1.177/glyh/#/';
const TEST_USER = {
  username: 'sheng01',
  password: 'sheng01@123456'
};

test.describe('公路养护系统测试', () => {
  
  // 登录前置操作
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('登录功能测试', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 验证登录成功 - 等待地图加载
    await page.waitForLoadState('networkidle');
    await expect(page.locator('canvas')).toBeVisible();
    
    console.log('✅ 登录成功');
  });

  test('地图图例交互测试', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 打开图例
    await page.getByRole('button', { name: ' 图例' }).click();
    
    // 切换省道图层
    await page.locator('span').filter({ hasText: /^省道$/ }).click();
    
    // 切换国道图层
    await page.locator('span').filter({ hasText: '国道' }).click();
    
    // 验证地图可交互
    await expect(page.locator('canvas')).toBeVisible();
    
    console.log('✅ 地图图例交互成功');
  });

  test('资产管理-路线信息查看', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 点击资产情况菜单
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    
    // 进入路线信息
    await page.getByText('路线信息').click();
    
    // 验证页面加载
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 路线信息页面加载成功');
  });

  test('桥梁管理-查看详情', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 进入桥梁管理
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    await page.getByText('桥梁管理').click();
    
    // 等待表格加载
    await page.waitForSelector('.el-table__body');
    
    // 点击第一行的查看按钮
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.view-btn-action').click();
    
    // 验证详情页加载
    await expect(page.getByRole('button', { name: '返回上一级' })).toBeVisible();
    
    // 返回列表
    await page.getByRole('button', { name: '返回上一级' }).click();
    
    console.log('✅ 桥梁详情查看成功');
  });

  test('隧道管理-查看和操作', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 进入隧道管理
    await page.getByRole('menubar').locator('div').filter({ hasText: '资产情况' }).click();
    await page.getByText('隧道管理').click();
    
    // 等待表格加载
    await page.waitForSelector('.el-table__body');
    
    // 点击查看
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.view-btn-action').click();
    
    // 点击第一个操作按钮
    await page.locator('.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row').first()
      .locator('.cell > span').first().click();
    
    // 关闭弹窗
    await page.getByRole('button', { name: 'Close' }).click();
    
    console.log('✅ 隧道管理操作成功');
  });

  test('附属设施管理-菜单导航', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 点击附属设施管理
    await page.getByRole('menuitem', { name: '附属设施管理' }).click();
    
    // 切换到交安设施
    await page.getByText('交安设施').click();
    await page.waitForLoadState('networkidle');
    
    // 切换到交调站管理
    await page.getByText('交调站管理').click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 附属设施菜单导航成功');
  });

  test('巡查养护-完整流程', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 进入巡查养护
    await page.getByRole('menubar').locator('div').filter({ hasText: '巡查养护' }).click();
    
    // 路面巡查
    await page.getByText('路面巡查').click();
    await page.waitForLoadState('networkidle');
    
    // 资产纠错
    await page.getByText('资产纠错').click();
    await page.waitForLoadState('networkidle');
    
    // 病害一张图
    await page.getByText('病害一张图').click();
    
    // 选择月份
    await page.getByRole('textbox', { name: '请选择月份' }).first().click();
    await page.getByText('一月', { exact: true }).click();
    
    console.log('✅ 巡查养护流程测试成功');
  });

  test('桥梁巡查-检查类型切换', async ({ page }) => {
    await loginWithManualCaptcha(page);
    
    // 进入桥梁巡查
    await page.getByRole('menubar').locator('div').filter({ hasText: '巡查养护' }).click();
    await page.getByText('桥梁巡查').click();
    
    // 切换日常巡查
    await page.getByText('日常巡查', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    
    // 切换经常性检查
    await page.getByText('经常性检查').click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 桥梁巡查检查类型切换成功');
  });
});

// 手动输入验证码的登录函数
async function loginWithManualCaptcha(page) {
  // 填写用户名
  await page.getByRole('textbox', { name: '账户名' }).fill(TEST_USER.username);
  
  // 填写密码
  await page.getByRole('textbox', { name: '密码' }).fill(TEST_USER.password);
  
  console.log('⏸️  请手动输入验证码,然后按 Resume 继续...');
  
  // 暂停等待手动输入验证码
  await page.pause();
  
  // 点击登录
  await page.getByRole('button', { name: '登录' }).click();
  
  // 等待登录完成
  await page.waitForLoadState('networkidle');
}
