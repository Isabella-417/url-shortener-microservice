"use strict";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const { findOne, save, createModel } = require("./connection");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.json());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", async (req, res) => {
  const url = req.body.url;
  const shortUrl = shortid.generate();
  const dateRegex = /(https|http):\/\/[\w\.\-\/]+/.test(url);
  if (!dateRegex) {
    res.json({ error: "invalid url" });
  } else {
    let existUrl = await findOne({ original_url: url });
    if (existUrl) {
      res.json({ original_url: url, short_url: existUrl.short_url });
    } else {
      const urlModel = createModel({ original_url: url, short_url: shortUrl });
      save(urlModel);
      res.json({
        original_url: urlModel.original_url,
        short_url: urlModel.short_url,
      });
    }
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shortUrl = req.params.short_url;
  const existUrl = await findOne({ short_url: shortUrl });
  if (existUrl) {
    return res.redirect(existUrl.original_url);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
