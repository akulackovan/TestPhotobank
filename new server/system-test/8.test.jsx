import puppeteer from "puppeteer";

test("Search page", async () => {
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

  // Fill "test" on <input> [placeholder="\41F\41E\418\421\41A"]
  await page.waitForSelector('[data-testid="searchInput"]:not([disabled])');
  await page.type('[data-testid="searchInput"]', "test");

  // Press Enter on input
  await page.waitForSelector('[data-testid="searchInput"]');
  await Promise.all([page.keyboard.press("Enter"), page.waitForNavigation()]);

  // Click on <li> "test"
  await page.waitForSelector('[data-testid="searchUser"]');

  //Ссылка на test
  await page.waitForSelector('[href="/profile/641de3cb94ae5238b2ce1b12"]');

  await browser.close();
});
