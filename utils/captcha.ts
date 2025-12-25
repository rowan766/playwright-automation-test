import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import * as fs from 'fs';

/**
 * OCR 识别验证码
 * @param imageBuffer 验证码图片 Buffer
 * @returns 识别出的验证码文本
 */
export async function recognizeCaptcha(imageBuffer: Buffer): Promise<string> {
  try {
    // 图片预处理:放大、转灰度、增强对比度、锐化
    const processedImage = await sharp(imageBuffer)
      .resize(200, 60, { // 放大图片提高识别率
        kernel: sharp.kernel.lanczos3,
        fit: 'fill'
      })
      .greyscale()
      .normalize()
      .sharpen()
      .threshold(120) // 二值化
      .toBuffer();
    
    // 保存处理后的图片用于调试
    if (process.env.DEBUG_CAPTCHA) {
      fs.writeFileSync('captcha-processed.png', processedImage);
    }
    
    // OCR 识别 - 尝试多种配置
    let text = '';
    
    // 尝试 1: 标准配置
    try {
      const result = await Tesseract.recognize(processedImage, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      });
      text = result.data.text;
    } catch (error) {
      console.warn('⚠️  标准 OCR 失败,尝试备用配置');
    }
    
    // 尝试 2: 如果失败,用单词模式
    if (!text || text.trim().length < 3) {
      const result = await Tesseract.recognize(processedImage, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_WORD,
      });
      text = result.data.text;
    }
    
    // 清理结果:去除所有空格、换行、特殊字符
    const captchaCode = text
      .trim()
      .replace(/\s+/g, '')  // 去除空格
      .replace(/[^a-zA-Z0-9]/g, '')  // 只保留字母和数字
      .toLowerCase();
    
    console.log(`🔍 OCR 原始识别: "${text}"`);
    console.log(`✅ 清理后结果: "${captchaCode}"`);
    
    return captchaCode;
  } catch (error) {
    console.error('❌ 验证码识别失败:', error);
    throw error;
  }
}

/**
 * 获取并识别页面上的验证码
 * @param page Playwright Page 对象
 * @param captchaSelector 验证码图片选择器
 * @returns 识别出的验证码文本
 */
export async function getCaptchaFromPage(page: any, captchaSelector: string): Promise<string> {
  try {
    // 等待验证码加载
    await page.waitForSelector(captchaSelector, { timeout: 5000 });
    
    // 截取验证码图片
    const captchaElement = await page.locator(captchaSelector);
    const imageBuffer = await captchaElement.screenshot();
    
    // 保存原始图片用于调试
    if (process.env.DEBUG_CAPTCHA) {
      fs.writeFileSync('captcha-original.png', imageBuffer);
      console.log('📸 验证码图片已保存: captcha-original.png, captcha-processed.png');
    }
    
    // OCR 识别
    const captchaCode = await recognizeCaptcha(imageBuffer);
    
    // 放宽验证:2 个字符也接受
    if (!captchaCode || captchaCode.length < 2) {
      throw new Error(`验证码识别结果异常: "${captchaCode}"`);
    }
    
    return captchaCode;
  } catch (error) {
    console.error('❌ 获取验证码失败:', error);
    throw error;
  }
}
