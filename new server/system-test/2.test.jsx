import puppeteer from "puppeteer";

test("Wrong password", async () => {
  const browser = await puppeteer.launch({
    //headless: false, slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Fill "test" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "test");

  // Fill "test123" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "test123");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await page.click('[data-testid="login-button"]');

  // Click on <p> ""Описание пользователя" д..."
  await page.waitForSelector(".error");
  //Проверка на сообщение
  await page.$eval(".error", (el) => (el.textContent = "Неверный пароль"));

  await browser.close();
});
