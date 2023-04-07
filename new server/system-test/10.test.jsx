import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Post from "../models/Post";

test("Wrong password in settings", async () => {
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

  // Click on <a> "Настройки"
  await page.waitForSelector('[href="/settings"]');
  await Promise.all([
    page.click('[href="/settings"]'),
    page.waitForNavigation(),
  ]);

  // Press м on textarea
  await page.waitForSelector("#password");
  await page.type(
    "#password",
    "тест"
  );
    // Press м on textarea
    await page.waitForSelector("#newpass");
    await page.type(
      "#newpass",
      "тест"
    );

  // Press м on textarea
  await page.waitForSelector("#checkpass");
  await page.type(
    "#checkpass",
    "тест"
  );



  // Click on <button> "СОХРАНИТЬ"
  await page.waitForSelector(".save");
  await page.click(".save");

  // Click on <p> ""Описание пользователя" д..."
  await page.waitForSelector(".error");
  //Проверка на сообщение
  await page.$eval(
    ".error",
    (el) =>
      (el.textContent =
        'Указан неверный пароль')
  );

  await browser.close();

    await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await Post.deleteOne({ author: "641de507eb5f99ce0e215de5" });

  await mongoose.connection.close();
});
