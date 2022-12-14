/**
 * file: js/graph.js
 * date: 10/04/2022
 * description: file responsible for the authentication with the Microsoft Graph API.
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

// Create an authentication provider
const authProvider = {
  getAccessToken: async () => {
    // Call getToken in auth.js
    return await getToken();
  },
};

// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

//Get user info from Graph
async function getUser() {
  ensureScope('user.read');
  return await graphClient.api('/me').select('id,displayName').get();
}

async function getEmails(nextLink) {
  ensureScope('mail.read');

  if (nextLink) {
    return await graphClient.api(nextLink).get();
  } else {
    return await graphClient
      .api('/me/messages')
      .select('subject,receivedDateTime')
      .orderby('receivedDateTime desc')
      .top(10)
      .get();
  }
}
