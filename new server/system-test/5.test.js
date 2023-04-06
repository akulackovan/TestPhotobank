import puppeteer from "puppeteer";

test("Busy login in settings", async () => {
  const browser = await puppeteer.launch({
    //headless: false, slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Fill "test" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "test");

  // Fill "test" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "test");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await Promise.all([
    page.click('[data-testid="login-button"]'),
    page.waitForNavigation(),
  ]);

  // Click on <a> "Настройки"
  await page.waitForSelector('[href="/settings"]');
  await Promise.all([
    page.click('[href="/settings"]'),
    page.waitForNavigation(),
  ]);

  // Click on <input> #username
  await page.waitForSelector("#username");
  await page.click("#username");

  // Fill "test" on <input> #username
  await page.waitForSelector("#username:not([disabled])");
  await page.type("#username", "test");

  // Click on <button> "СОХРАНИТЬ"
  // Click on <button> "СОХРАНИТЬ"
  await page.waitForSelector(".save");
  await page.click(".save");

  // "Логин"
  await page.waitForSelector(".error");
  //Проверка на сообщение
  await page.$eval(
    ".error",
    (el) => (el.textContent = "Логин занят. Выберите другой")
  );
  await browser.close();
});
