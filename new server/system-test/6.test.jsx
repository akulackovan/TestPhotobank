import puppeteer from "puppeteer";

test("Busy login in reg", async () => {
  const browser = await puppeteer.launch({
    //headless: false, slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Click on <button> "РЕГИСТРАЦИЯ"
  await page.waitForSelector(".button:nth-child(5)");
  await Promise.all([
    page.click(".button:nth-child(5)"),
    page.waitForNavigation(),
  ]);

  // Fill "test" on <input> #username
  await page.waitForSelector("#username:not([disabled])");
  await page.type("#username", "test");

  // Fill "test" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "test");

  // Click on <div> "Город"
  await page.waitForSelector('[data-testid="button"]');
  await page.click('[data-testid="button"]');

  // Click on <div> "Москва"
  await page.waitForSelector(
    '[data-testid="city-dropdownelement"]:nth-child(2)'
  );
  await page.click('[data-testid="city-dropdownelement"]:nth-child(2)');

  // Click on <button> "ЗАРЕГИСТРИРОВАТЬСЯ"
  await page.waitForSelector(".button");
  await page.click(".button");

  // "Логин"
  await page.waitForSelector(".error");
  //Проверка на сообщение
  await page.$eval(
    ".error",
    (el) => (el.textContent = "Логин занят. Выберите другой")
  );
  await browser.close();
});
