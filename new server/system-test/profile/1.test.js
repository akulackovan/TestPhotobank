import puppeteer from "puppeteer";

test("Go to profile page", async () => {
    const browser = await puppeteer.launch({
         //headless: false, slowMo: 100, // Uncomment to visualize test
      });
      const page = await browser.newPage();
    
      // Load "http://localhost:3000/auth"
      await page.goto('http://localhost:3000/auth');

  
      // Fill "test" on <input> [data-testid="username"]
      await page.waitForSelector('[data-testid="username"]:not([disabled])');
      await page.type('[data-testid="username"]', "test");
    
    
      // Fill "test" on <input> #password
      await page.waitForSelector('#password:not([disabled])');
      await page.type('#password', "test");
    
      // Click on <button> "ВОЙТИ"
      await page.waitForSelector('[data-testid="login-button"]');
      await Promise.all([
        page.click('[data-testid="login-button"]'),
        page.waitForNavigation()
      ]);
    
      // Click on <a> "Профиль"
      await page.waitForSelector('[href="/profile"]');
      await Promise.all([
        page.click('[href="/profile"]'),
        page.waitForNavigation()
      ]);
    
      // Аватарка
      await page.waitForSelector('.img', {
        visible: true,
      })
      
      //Описание
      await page.waitForSelector('.text', {
        visible: true,
      })
  
    
      // Click on <div> "Количество подписчиков"
      await page.waitForSelector('.subs', {
        visible: true,
      })

      //Посты
      await page.waitForSelector('.posts', {
        visible: true,
      })

      //Имя пользователя
      await page.waitForSelector('.user', {
        visible: true,
      })

      //Добавить фото
      await page.waitForSelector('.addPhoto', {
        visible: true,
      })
    
      await browser.close();

})