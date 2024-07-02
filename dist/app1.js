"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const server = new express();
server.get("/", (req, res) => {
    console.log(req.url);
    res.status(200).send("HI MY NAME IS DORA !! -- du du dora, dudu dora, du du dora ");
});
server.get("/explore", (req, res) => {
    console.log(req.url);
    let data = {
        profile: {
            name: "bhuji",
            age: 57,
        },
        place: {
            city: "mexico",
            pincode: 789456,
        },
    };
    res.status(200).send(data);
});
server.listen(3000, () => {
    console.log("server is running on port 3000");
});
//# sourceMappingURL=app1.js.map