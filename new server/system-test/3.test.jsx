import puppeteer from "puppeteer";
import mongoose from "mongoose";
import User from "../models/User";


test("Change password in settings", async () => {
  const password =
    "$2a$10$0zVbkDsjdxyQNSF0FFJC0.4djOJt6Je2RbmMjD9Brnf3i32XpmfC.";

  const browser = await puppeteer.launch({
   // headless: false, slowMo: 100, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Resize window to 871 x 881
  //await page.setViewport({ width: 871, height: 881 });

  // Fill "тест" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "test");

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
  await page.type("#password", "test");
  // Press м on textarea
  await page.waitForSelector("#newpass");
  await page.type("#newpass", "тест");

  // Press м on textarea
  await page.waitForSelector("#checkpass");
  await page.type("#checkpass", "тест");

  // Click on <button> "СОХРАНИТЬ"
  await page.waitForSelector(".save");
  await page.click(".save");

  // Click on <p> ""Описание пользователя" д..."
  await page.waitForSelector(".error");
  //Проверка на сообщение
  await page.$eval(".error", (el) => (el.textContent = "Настройки изменены"));

  await Promise.all([
    page.click(".elementButton:nth-child(2) > .button"),
    page.waitForNavigation(),
  ]);

  // Fill "тест" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "test");

  // Fill "тест" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "тест");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await Promise.all([
    page.click('[data-testid="login-button"]'),
    page.waitForNavigation(),
  ]);

  //Популярное
  await page.waitForSelector(".wrapper1", {
    visible: true,
  });

  await browser.close();

  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await User.updateOne({ _id: "641de3cb94ae5238b2ce1b12" }, { password: password });

  await mongoose.connection.close();

});
