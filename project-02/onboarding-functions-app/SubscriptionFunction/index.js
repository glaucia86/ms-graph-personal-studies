/**
 * file: SubscriptionFunction/index.js
 * date: 09/26/2022
 * description: file responsible for the subscription function.
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

require('isomorphic-fetch');
const graph = require('../shared/graph');

module.exports = async function (context, myTimer) {
  const subscription = await graph.postSubscriptionAsync();
};
