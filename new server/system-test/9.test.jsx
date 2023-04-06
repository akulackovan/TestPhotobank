import puppeteer from "puppeteer";

test("Wrong text", async () => {
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
  await page.waitForSelector("#text");
  await page.type(
    "#text",
    "Замысел эпопеи формировался задолго до начала работы над тем текстом, который известен под названием «Война и мир». В наброске предисловия к «Войне и миру» Толстой писал, что в 1856 году начал писать повесть, «герой которой должен был быть декабрист, возвращающийся с семейством в Россию. Невольно от настоящего я перешёл к 1825 году… Но и в 1825 году герой мой был уже возмужалым, семейным человеком. Чтобы понять его, мне нужно было перенестись к его молодости, и молодость его совпала с … эпохой 1812 года… Ежели причина нашего торжества была не случайна, но лежала в сущности характера русского народа и войска, то характер этот должен был выразиться ещё ярче в эпоху неудач и поражений…» Так Лев Николаевич постепенно пришёл к необходимости начать повествование с 1805 года. Главная тема — историческая судьба русского народа в Отечественной войне 1812 года. В романе выведено более 550 персонажей, как вымышленных, так и исторических. Лучших своих героев Л. Н. Толстой изображает во всей их душевной сложности, в непрерывных поисках истины, в стремлении к самосовершенствованию. Таковы князь Андрей, граф Николай, граф Пьер, графиня Наташа и княжна Марья. Отрицательные герои лишены развития, динамики, движений души: Элен, Анатоль."
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
        '"Описание пользователя" должно содержать не более 512 символов')
  );

  await browser.close();
});
