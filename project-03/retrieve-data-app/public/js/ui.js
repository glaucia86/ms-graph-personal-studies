/**
 * file: js/ui.js
 * date: 10/04/2022
 * description: file responsible for the UI of the application.
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

async function displayUI() {
  await signIn();

  // Display info from user profile
  const user = await getUser();
  var userName = document.getElementById('userName');
  userName.innerText = user.displayName;

  // Hide login button and initial UI
  var signInButton = document.getElementById('signin');
  signInButton.style = 'display: none';
  var content = document.getElementById('content');
  content.style = 'display: block';
}
