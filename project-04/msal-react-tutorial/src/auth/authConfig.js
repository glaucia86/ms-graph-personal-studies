/**
 * file: src/auth/authConfig.js
 * date: 10/18/2022
 * description: file responsible for the authentication configuration
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

require('dotenv').config();

export const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    authority: process.env.OAUTH_AUTHORITY,
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStatInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
