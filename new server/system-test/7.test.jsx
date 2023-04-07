import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";

test("Add comment", async () => {
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

  // Fill "Это тест" on <textarea> [data-testid="commentInput"]
  await page.waitForSelector('[data-testid="commentInput"]:not([disabled])');
  await page.type('[data-testid="commentInput"]', "Это тест");

  // Click on <button> "ОПУБЛИКОВАТЬ"
  await page.waitForSelector('[data-testid="commentButton"]');
  await page.click('[data-testid="commentButton"]');

  // Click on <li> "test  Это тест"
  await page.waitForSelector('[data-testid="comment"]');
  await page.click('[data-testid="comment"]');

  let child = await page.$eval('[data-testid="comment"]', (e) => e.children);
  console.log(child);

  await browser.close();
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );

  await Comment.deleteMany({});
  await Post.updateOne(
    { _id: "63e0069aa21a301d9852da3a" },
    { $set: { comments: [] } }
  );
  await mongoose.connection.close();
});
