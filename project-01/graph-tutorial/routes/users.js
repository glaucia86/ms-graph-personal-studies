/**
 * file: routes/users.js
 * date: 09/12/2022
 * description: file responsible for the 'users' route of the api
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
