/**
 * file: shared/graph.js
 * date: 09/23/2022
 * description: file responsible for the graph.
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
    console.log('Error to ensure Graph for App Only Auth: ', error);
    return handleError(500, error);
  }
}
