const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require('axios');
const Parser = require('rss-parser');

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/", (req, res) => {
  res.render("news");
});


const parser = new Parser();

router.get('/attack', async (req, res) => {
  const feedUrl = 'https://www.cshub.com/rss/categories/attacks'
  const feedData = [];
    try {
      const feed = await parser.parseURL(feedUrl);
      feedData.push({ title: feed.title, items: feed.items });
      res.json(feedData);
    } catch (error) {
      console.error(`Error fetching or parsing feed: ${feedUrl}`, error);
    }
});

router.get('/threat', async (req, res) => {
  const feedUrl = 'https://www.cshub.com/rss/categories/threat-defense'
  const feedData = [];
    try {
      const feed = await parser.parseURL(feedUrl);
      feedData.push({ title: feed.title, items: feed.items });
      res.json(feedData);
    } catch (error) {
      console.error(`Error fetching or parsing feed: ${feedUrl}`, error);
    }
});

router.get('/malware', async (req, res) => {
  const feedUrl = 'https://www.cshub.com/rss/categories/malware'
  const feedData = [];
    try {
      const feed = await parser.parseURL(feedUrl);
      feedData.push({ title: feed.title, items: feed.items });
      res.json(feedData);
    } catch (error) {
      console.error(`Error fetching or parsing feed: ${feedUrl}`, error);
    }
});

module.exports = router;
