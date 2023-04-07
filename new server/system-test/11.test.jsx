import puppeteer from "puppeteer";

test("Check null subs", async () => {
  const browser = await puppeteer.launch({
    //headless: false, slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Resize window to 871 x 881
  //await page.setViewport({ width: 871, height: 881 });

  // Fill "тест" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "test");

  // Click on <input> #password
  await page.waitForSelector("#password");
  await page.click("#password");

  // Fill "тест" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "test");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await Promise.all([
    page.click('[data-testid="login-button"]'),
    page.waitForNavigation(),
  ]);
  // Click on <a> "Подписки"
  await page.waitForSelector('[href="/subsc"]');
  await Promise.all([page.click('[href="/subsc"]'), page.waitForNavigation()]);

  //
  await page.waitForSelector(".center:nth-child(1)");
  //Проверка на сообщение
  await page.$eval(
    ".center:nth-child(1)",
    (el) => (el.textContent = "Нет подписок")
  );

  await browser.close();
});
