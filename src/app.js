const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const viewRouter = require("./routers/viewRouter");
const apiRouter = require("./routers/apiUserRouter");

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.use((req, res, next) => {
    next();
    console.log(req.method + " " + req.path + ": " + res.statusCode)
})

app.use(express.static('src/public'))

app.use("/api", apiRouter);
app.use("/", viewRouter);

app.listen(8080);
console.log("Server started");