/**
 * Dieses Skript veröffentlicht die Consumer Contracts in Form von Pact-Files,
 * die während des Testlaufs erzeugt wurden, an den Pact Broker.
 *
 * Das Skript geht davon aus, dass es neben der package.json liegt, da es
 * die Projekt-Version aus dieser Datei zieht.
 */
const BROKER_URL = 'http://pact.remondis-de.local/';

let project = require('./package.json');
let projectFolder = __dirname;
let pact = require('@pact-foundation/pact-node');
let tag = process.argv[2];

if (tag === undefined) {
  console.error(
    "Please provide a tag for the published Pact as command line argument!")
  process.exit(1);
}

let opts = {
  pactFilesOrDirs: [projectFolder + '/pacts'],
  pactBroker: BROKER_URL,
  consumerVersion: project.version,
  tags: [tag]

  // aktuell erfordert der Pact Broker keine Credentials
  // pactBrokerUsername: <String>,
  // pactBrokerPassword: <String>,
};

pact.publishPacts(opts).then(function () {
  console.log("Pacts successfully published with the tag '" + tag + "'!");
}, function () {
  process.exit(1);
});
