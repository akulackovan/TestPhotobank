import puppeteer from "puppeteer";
import mongoose from "mongoose";
import User from "../models/User";

test("Registration", async () => {
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
  await page.type("#username", "testik");

  // Fill "test" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "testik");

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
  await Promise.all([await page.click(".button"), page.waitForNavigation()]);

  // Fill "test" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "testik");

  // Fill "test" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "testik");

  // Click on <button> "ВОЙТИ"
  await page.waitForSelector('[data-testid="login-button"]');
  await Promise.all([
    page.click('[data-testid="login-button"]'),
    page.waitForNavigation(),
  ]);

  //Посты
  await page.waitForSelector(".wrapper1", {
    visible: true,
  });

  await browser.close();
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await User.deleteOne({ username: "testik" });

  await mongoose.connection.close();
});
