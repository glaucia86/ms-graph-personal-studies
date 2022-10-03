/**
 * file: js/auth.js
 * date: 10/04/2022
 * description: file responsible for authenticating the user.
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const msalConfig = {
  auth: {
    clientId: '5fd9cd77-4518-4ef4-a81d-dcf5ba1ad142',
    authority:
      'https://login.microsoftonline.com/a3d6bd18-e1a2-49ad-a4c5-bb627f453d95',
    redirectUri: 'http://localhost:8080',
  },
};

const msalRequest = { scopes: [] };
function ensureScope(scope) {
  if (
    !msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())
  ) {
    msalRequest.scopes.push(scope);
  }
}
//Initialize MSAL client
const msalClient = new msal.PublicClientApplication(msalConfig);

// Log the user in
async function signIn() {
  const authResult = await msalClient.loginPopup(msalRequest);
  sessionStorage.setItem('msalAccount', authResult.account.username);
}
//Get token from Graph
async function getToken() {
  let account = sessionStorage.getItem('msalAccount');
  if (!account) {
    throw new Error(
      'User info cleared from session. Please sign out and sign in again.'
    );
  }
  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account),
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}
