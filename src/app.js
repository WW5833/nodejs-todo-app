const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const viewRouter = require("./routers/viewRouter");
const apiRouter = require("./routers/apiRouter");

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

async function Wait(ms) {
    await new Promise((resolve, reject) => setTimeout(resolve, ms));
}

app.use(async (req, res, next) => {
    var url = req.url;
    next();

    if (url.startsWith("/api")) {
        while (!req.complete)
            await Wait(100);
    }

    console.log(`${req.method} ${url}: ${res.statusMessage ?? "Ok"} (${res.statusCode})`);
})

app.use(express.static('src/public'))

app.use("/api", apiRouter);
app.use("/", viewRouter);

app.listen(8080);
console.log("Server started");