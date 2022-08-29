/**
 * file: routes/index.js
 * date: 08/29/2022
 * description: file responsible for the 'index' route of the api
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let params = {
    active: { home: true },
  };

  res.render('index', params);
});

module.exports = router;
