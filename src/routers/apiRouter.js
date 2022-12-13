const express = require("express");
const router = express.Router();
const users = require("../model/users")
const todo = require("../model/todo")

router.use("/", async (req, res, next) => {
    console.log(req.body)
    if(req.body.user_id) {
        req.__user = await users.findById(req.body.user_id);
        console.log("Found user!: "  +req.__user.Username)
    }
    else {
    }
    next();
});

router.get("/todo", (req, res) => {
    const data = todo.find((err, data) => {
        if(err) console.error(err)
        res.json(data);
    })
});

router.get("/todo/:date", (req, res) => {
    const date = new Date(req.params.date).getTime()
    var filter = { };
    if(req.query["status"]) {
        filter["State"] = req.query["status"] == "true";
    }
    const data = todo.find(filter, (err, data) => {
        if(err) console.error(err)
        res.json(data.filter(x => date == x.Date.getTime()));
    })
});

router.post("/todo", (req, res) => {
    let payload = req.body;
    payload["State"] = false;
    const model = new todo(payload);
    const data = model.save((err, data) => {
        if(err) console.error(err)
        res.json(data);
    })
});

router.put("/todo/:id/:status", async (req, res) => {
    const data = await todo.findByIdAndUpdate(req.params.id, { State: req.params.status == "true"});

    if(!data) {
        res.status("400").json({error: 400, Message: "Todo with supplied id was not found"})
        return;
    }
    res.send("Updated");
});

router.delete("/todo/:id", async (req, res) => {
    const result = await todo.findByIdAndDelete(req.params.id);

    if(!result) {
        res.status("400").json({error: 400, Message: "Todo with supplied id was not found"})
        return;
    }

    res.send("Updated");
});

module.exports = router;