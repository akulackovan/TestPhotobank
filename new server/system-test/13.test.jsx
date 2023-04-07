import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Post from "../models/Post";
import { user2 } from "./database.js";

test("Add post", async () => {

  const browser = await puppeteer.launch({
    //headless: false,
    //slowMo: 10, // Uncomment to visualize test
  });
  const page = await browser.newPage();

  // Load "http://localhost:3000/auth"
  await page.goto("http://localhost:3000/auth");

  // Resize window to 1745 x 890
  //await page.setViewport({ width: 1745, height: 890 });

  // Fill "тест" on <input> [data-testid="username"]
  await page.waitForSelector('[data-testid="username"]:not([disabled])');
  await page.type('[data-testid="username"]', "tessi");

  // Fill "тест" on <input> #password
  await page.waitForSelector("#password:not([disabled])");
  await page.type("#password", "tessi");

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
  

  // Нет постов
  // Click on <h1> "Нет постов"
  await page.waitForSelector('.wrapper > h1');
  await page.$eval(
    '.wrapper > h1',
    (el) => (el.textContent = "Нет постов")
  );

  // Click on <a> "Добавить фото"
  await page.waitForSelector('[href="/post"]');
  await Promise.all([page.click('[href="/post"]'), page.waitForNavigation()]);

  await page.waitForSelector('.input__file_img');

  
  const [ fileChooser ] = await Promise.all([
    page.waitForFileChooser(),
    page.click(".input__file-button")
  ])

  await fileChooser.accept(['test.jpg'])

  // Click on <button> "Обрезать"
  await page.waitForSelector(".button:nth-child(2)");
  await page.click(".button:nth-child(2)");

  // Click on <div> "Город"
  await page.waitForSelector('[data-testid="button"]');
  await page.click('[data-testid="button"]');

  // Click on first
  await page.waitForSelector(
    '[data-testid="city-dropdownelement"]:nth-child(2)'
  );
  await page.click('[data-testid="city-dropdownelement"]:nth-child(2)');

  // Click on <button> "ЗАГРУЗИТЬ ФОТО"
  await page.waitForSelector('[data-testid="upload"]');
  await Promise.all([page.click('[data-testid="upload"]'), page.waitForNavigation()]);


  // Проверка на то, что есть галерея
  await page.waitForSelector('.gal');

  await browser.close();

  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await Post.deleteOne({ author: "641de507eb5f99ce0e215de5" });

  await mongoose.connection.close();
});
