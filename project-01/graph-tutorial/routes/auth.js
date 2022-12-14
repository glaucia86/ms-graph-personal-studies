/**
 * file: routes/auth.js
 * date: 09/09/2022
 * description: file responsible for the 'auth' route of the api
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const router = require('express-promise-router')();
const graph = require('../graph');

router.get('/signin', async function (req, res) {
  const urlParameters = {
    scopes: process.env.OAUTH_SCOPES.split(','),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };

  try {
    const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(
      urlParameters
    );
    res.redirect(authUrl);
  } catch (error) {
    console.log(`Error: ${error}`);
    req.flash('error_msg', {
      message: 'Error getting auth URL',
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    res.redirect('/');
  }
});

router.get('/callback', async function (req, res) {
  const tokenRequest = {
    code: req.query.code,
    scopes: process.env.OAUTH_SCOPES.split(','),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };

  try {
    const response = await req.app.locals.msalClient.acquireTokenByCode(
      tokenRequest
    );

    req.session.userId = response.account.homeAccountId;

    const user = await graph.getUserDetails(
      req.app.locals.msalClient,
      req.session.userId
    );

    req.app.locals.users[req.session.userId] = {
      displayName: user.displayName,
      email: user.mail || user.userPrincipalName,
      timeZone: user.mailboxSettings.timeZone,
    };
  } catch (error) {
    req.flash('error_msg', {
      message: 'Error completing authentication',
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }

  res.redirect('/');
});

router.get('/signout', async function (req, res) {
  if (req.session.userId) {
    const accounts = await req.app.locals.msalClient
      .getTokenCache()
      .getAllAccounts();

    const userAccount = accounts.find(
      (a) => a.homeAccountId === req.session.userId
    );

    if (userAccount) {
      req.app.locals.msalClient.getTokenCache().removeAccount(userAccount);
    }
  }

  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
