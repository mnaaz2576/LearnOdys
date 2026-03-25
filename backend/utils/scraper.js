const puppeteer = require("puppeteer");

const getCourses = async (skill = "programming") => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    let allCourses = [];

    // scrape multiple pages
    for (let pageNum = 0; pageNum < 5; pageNum++) {

      await page.goto(
        `https://ocw.mit.edu/search/?q=${skill}&page=${pageNum}`,
        { waitUntil: "domcontentloaded" }
      );

      await new Promise(r => setTimeout(r, 4000));

      // scroll page
      for (let i = 0; i < 4; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(r => setTimeout(r, 1500));
      }

      const courses = await page.evaluate((skill) => {

        const data = [];

        document.querySelectorAll("a").forEach(el => {

          const title = el.innerText.trim();
          const link = el.href;

          if (
            link.includes("/courses/") &&
            title.length > 15 &&
            !title.includes("\n")
          ) {

            data.push({
              title: title,
              link: link,
              platform: "MIT OpenCourseWare",
              skill: skill,
              source: "scraper"
            });

          }

        });

        return data;

      }, skill);

      allCourses = [...allCourses, ...courses];
    }

    // remove duplicates
    const uniqueCourses = Array.from(
      new Map(allCourses.map(c => [c.link, c])).values()
    );

    await browser.close();

    return uniqueCourses.slice(0, 300);

  } catch (err) {

    console.log("ERROR:", err.message);

    if (browser) await browser.close();

    return [];
  }
};

module.exports = getCourses;