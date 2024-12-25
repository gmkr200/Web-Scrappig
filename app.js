const express = require("express");
const app = express();
const cheerio = require("cheerio");
const path = require("path");
const puppeteer = require("puppeteer");

let browser;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


async function scrapeData(url, page) {
    try {
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);
        let title = $(".header_poster_wrapper.true > section > div.title.ott_true > h2 > a").text();
        let date = $(".header_poster_wrapper.true > section > div.title.ott_true > h2 > span").text();
        let overview = $(".overview > p").text();
        let rating = $(".user_score_chart").attr("data-percent");
        let image = $(".blurred > img").attr("src");
        
        let crewLength = $(".header_info > ol > li").length;
let crew = [];

for (let i = 1; i <= crewLength; i++) {
    let name = $(`.header_info > ol > li:nth-child(${i}) > p:nth-child(1)`).text();
    let role = $(`#original_header > div.header_poster_wrapper.true > section > div.header_info > ol > li:nth-child(${i}) > p.character`).text();
    crew.push({ name, role });
}



        return {
            title,
            date,
            overview,
            rating,
            image,
            crew,
        

        }

    } catch (error) {
        console.log(error);
    }
}

app.get("/", async (req, res) => {
    res.render('search')
});
app.get("/result", async (req, res) => {
       browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const url = req.query.search;
        let result = await scrapeData(url, page);
    
   
    res.render('result',{result : result})
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});