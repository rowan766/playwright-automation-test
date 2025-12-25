import Tesseract from 'tesseract.js';
import sharp from 'sharp';

/**
 * OCR 识别验证码
 * @param imageBuffer 验证码图片 Buffer
 * @returns 识别出的验证码文本
 */
export async function recognizeCaptcha(imageBuffer: Buffer): Promise<string> {
  try {
    // 图片预处理:转灰度、增强对比度
    const processedImage = await sharp(imageBuffer)
      .greyscale()
      .normalize()
      .toBuffer();
    
    // OCR 识别
    const { data: { text } } = await Tesseract.recognize(processedImage, 'eng', {
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
    });
    
    // 清理结果:去除空格、换行等
    const captchaCode = text.trim().replace(/\s+/g, '').toLowerCase();
    
    console.log(`🔍 OCR 识别结果: ${captchaCode}`);
    
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
  // 等待验证码加载
  await page.waitForSelector(captchaSelector);
  
  // 截取验证码图片
  const captchaElement = await page.locator(captchaSelector);
  const imageBuffer = await captchaElement.screenshot();
  
  // OCR 识别
  const captchaCode = await recognizeCaptcha(imageBuffer);
  
  return captchaCode;
}
