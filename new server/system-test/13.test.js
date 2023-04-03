import puppeteer from "puppeteer";

test("Add post", async () => {
  const browser = await puppeteer.launch({
    //headless: false,
    //slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Resize window to 1745 x 890
  await page.setViewport({ width: 1745, height: 890 });

  // Click on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]');
  await page.click('[data-testid="username"]');

  // Fill "тест" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "тест");

  // Press Tab on input
  await page.waitForSelector('[data-testid="username"]');
  await page.keyboard.press("Tab");

  // Fill "тест" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "тест");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await Promise.all([
    page.click('[data-testid="login-button"]'),
    page.waitForNavigation(),
  ]);

  // Click on <a> "Профиль"
  await page.waitForSelector('[href="/profile"]');
  await Promise.all([
    page.click('[href="/profile"]'),
    page.waitForNavigation(),
  ]);

  // Click on <a> "Добавить фото"
  await page.waitForSelector('[href="/post"]');
  await Promise.all([page.click('[href="/post"]'), page.waitForNavigation()]);

  const elementHandle = await page.$("input[type=file]");
  await elementHandle.uploadFile("test.jpg");

  // Click on <button> "Обрезать"
  await page.waitForSelector(".button:nth-child(2)");
  await page.click(".button:nth-child(2)");

  // Click on <div> "Город"
  await page.waitForSelector('[data-testid="button"]');
  await page.click('[data-testid="button"]');

  // Click on <div> "Москва"
  await page.waitForSelector(
    '[data-testid="city-dropdownelement"]:nth-child(2)'
  );
  await page.click('[data-testid="city-dropdownelement"]:nth-child(2)');


  // Click on <button> "ЗАГРУЗИТЬ ФОТО"
  await page.waitForSelector(".button:nth-child(5)");
  await Promise.all([
    page.click(".button:nth-child(5)"),
    page.waitForNavigation(),
  ]);

  await browser.close();
});
