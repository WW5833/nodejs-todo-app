const express = require("express");
const router = express.Router();
const users = require("../model/users")
const todo = require("../model/todo")

router.post("/login", (req, res) => {
    let payload = req.body;
    const filter = { Username: payload.Username, Password: payload.Password };
    users.find(filter, (err, data) => {
        if(err) console.error(err)
        if(data.length == 0) {
            res.status(403).send("Invalid credentials");
            return;
        }

        res.json({ UserId: data[0]._id });
    });
});

router.post("/register", (req, res) => {
    const payload = req.body;

    const filter = { Username: payload.Username };
    users.find(filter, (err, data) => {
        if(err) console.error(err)
        if(data.length > 0) {
            res.status(400).send("Username already exists");
            return;
        }

        const model = new users(payload);
        model.save((err, data) => {
            if(err) console.error(err)
            res.json(data);
        });
    });
});

router.get("/:user/todo", (req, res) => {
    todo.find((err, data) => {
        if(err) console.error(err)
        res.json(data);
    })
});

router.get("/:user/todo/:date", (req, res) => {

    if(!req.params.date || req.params.date.length != 10) {
        res.status(400).json({error: 400, Message: "Valid date is required"});
        return;
    }

    const date = new Date(req.params.date).getTime()
    var filter = { User: req.params.user };
    if(req.query["status"]) {
        filter["State"] = req.query["status"] == "true";
    }
    todo.find(filter, (err, data) => {
        if(err) console.error(err)
        res.json(data.filter(x => date == x.Date.getTime()));
    })
});

router.post("/:user/todo", (req, res) => {
    let payload = req.body;

    if(!payload["Date"] || payload["Date"].length != 10) {
        res.status(400).json({error: 400, Message: "Valid date is required"});
        return;
    }

    if(!payload["Title"] || payload["Title"].length == 0) {
        res.status(400).json({error: 400, Message: "Title is required"});
        return;
    }

    payload["State"] = false;
    payload["User"] = req.params.user;
    const model = new todo(payload);
    model.save((err, data) => {
        if(err) console.error(err)
        res.json(data);
    })
});

router.put("/:user/todo/:id/:status", async (req, res) => {
    const data = await todo.findByIdAndUpdate(req.params.id, { State: req.params.status == "true"});

    if(!data) {
        res.status(400).json({error: 400, Message: "Todo with supplied id was not found"})
        return;
    }
    res.send("Updated");
});

router.delete("/:user/todo/:id", async (req, res) => {
    const result = await todo.findByIdAndDelete(req.params.id);

    if(!result) {
        res.status(400).json({error: 400, Message: "Todo with supplied id was not found"})
        return;
    }

    res.send("Updated");
});

module.exports = router;