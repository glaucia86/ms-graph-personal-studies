/**
 * file: OnboardingFunction/index.js
 * date: 09/26/2022
 * description: file responsible for the onboarding function
 * author: Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const graph = require('../shared/graph');

module.exports = async function (context, eventHubMessages) {
  context.log(
    `JavaScript eventhub trigger function called for message array ${eventHubMessages}`
  );

  eventHubMessages.forEach(async (message, index) => {
    const jsonMessage = JSON.parse(message);
    context.log(jsonMessage);

    for (let i in jsonMessage.value) {
      const resourceData = jsonMessage.value[i].resourceData;

      context.log(resourceData);

      const newMemberId = resourceData.id;

      await graph.postTeamsMemberAsync(newMemberId);
    }
  });
};
