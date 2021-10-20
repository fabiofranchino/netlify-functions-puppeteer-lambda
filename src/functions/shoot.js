const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    headless: chromium.headless
  })

  const page = await browser.newPage()

  await page.goto('https://www.google.com', {
    waitUntil: ['load']
  })

  const buffer = await page.screenshot({ type: 'png' })

  await browser.close()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'image/png'
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true
  }
}
