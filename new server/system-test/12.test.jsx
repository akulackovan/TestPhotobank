import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Post from "../models/Post";
import User from "../models/User";

test("Change like", async () => {
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

  //Посты
  await page.waitForSelector(".wrapper1", {
    visible: true,
  });

  // Click on <a> .gallery > [href="/post/63e0069aa21a301d9852da3a"]
  await page.waitForSelector(
    '.gallery > [href="/post/63e0069aa21a301d9852da3a"]'
  );
  await Promise.all([
    page.click('.gallery > [href="/post/63e0069aa21a301d9852da3a"]'),
    page.waitForNavigation(),
  ]);

  // Click on <svg> #like > svg
  await page.waitForSelector("#like > svg");
  await page.click("#like > svg");

  // Click on <div> "1"
  await page.waitForSelector('[data-testid="numlike"]');
  await page.$eval('[data-testid="numlike"]', (el) => (el.textContent = "0"));

  // Click on <svg> #unlike > svg
  await page.waitForSelector("#unlike > svg");

  // Click on <div> "1"
  await page.waitForSelector('[data-testid="numlike"]');
  await page.$eval('[data-testid="numlike"]', (el) => (el.textContent = "1"));

  await browser.close();
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await Post.updateOne(
    { _id: "63e0069aa21a301d9852da3a" },
    { $set: { likes: 0 } }
  );
  await User.updateOne(
    { _id: "641de3cb94ae5238b2ce1b12" },
    { $set: { likes: [] } }
  );
  await mongoose.connection.close();
});
