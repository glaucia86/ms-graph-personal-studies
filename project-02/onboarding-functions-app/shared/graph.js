/**
 * file: shared/graph.js
 * date: 09/23/2022
 * description: file responsible for the Microsoft graph.
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const handleError = require('./error');
const dotenv = require('dotenv');
const expiry = require('./dateTimeFormat');
require('isomorphic-fetch');

const azure = require('@azure/identity');
const graph = require('@microsoft/microsoft-graph-client');
const authProviders = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

dotenv.config();

let _clientSecretCredential = undefined;
let _appClient = undefined;
let _expiry = undefined;
let _memberId = undefined;

function ensureGraphForAppOnlyAuth() {
  try {
    if (!_clientSecretCredential) {
      _clientSecretCredential = new azure.ClientSecretCredential(
        process.env.AAD_APP_TENANT_ID,
        process.env.AAD_APP_CLIENT_ID,
        process.env.AAD_APP_CLIENT_SECRET
      );
    }

    if (!_appClient) {
      const authProvider =
        new authProviders.TokenCredentialAuthenticationProvider(
          _clientSecretCredential,
          {
            scopes: ['https://graph.microsoft.com/.default'],
          }
        );

      _appClient = graph.Client.initWithMiddleware({
        authProvider: authProvider,
      });
    }
  } catch (error) {
    console.log('Error to connect with Microsoft Graph', error);
    return handleError(500, error);
  }
}

async function postSubscriptionAsync() {
  ensureGraphForAppOnlyAuth();

  try {
    if (!_expiry) {
      _expiry = await expiry.getDateTimeAsync();
    }

    const subscription = {
      changeType: 'created, updated',
      notificationUrl: process.env.EVENT_HUB_NOTIFICATION_URL,
      resource: 'users',
      expirationDateTime: _expiry,
      clientState: 'secretClientState',
    };

    return _appClient?.api('/subscriptions').post(subscription);
  } catch (error) {
    console.log('Error to post Subscription: ', error);
    return handleError(500, error);
  }
}

async function postTeamsMemberAsync(memberId) {
  ensureGraphForAppOnlyAuth();

  try {
    _memberId = memberId;
    const user = `https://graph.microsoft.com/v1.0/users(\'${_memberId}\')`;
    const conversationMember = {
      '@odata.type': '#microsoft.graph.aadUserConversationMember',
      roles: ['owner'],
      'user@odata.bind': user,
    };

    return _appClient
      ?.api('/teams/1a37857c3c0e09e5/members')
      .post(conversationMember);
  } catch (error) {
    console.log('Error to post Teams Member: ', error);
    return handleError(500, error);
  }
}

module.exports = {
  postSubscriptionAsync,
  postTeamsMemberAsync,
};
