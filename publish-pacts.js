/**
 * Dieses Skript veröffentlicht die Consumer Contracts in Form von Pact-Files,
 * die während des Testlaufs erzeugt wurden, an den Pact Broker.
 *
 * Das Skript geht davon aus, dass es neben der package.json liegt, da es
 * die Projekt-Version aus dieser Datei zieht.
 */
const BROKER_URL = 'http://pact.remondis-de.local/';

let project = require('./package.json');
let pactFolder = __dirname + '/pacts';
let pact = require('@pact-foundation/pact-node');
let tag = process.argv[2];

if (tag === undefined) {
  console.error(
      "Please provide a tag for the published Pact as command line argument!")
  process.exit(1);
}

replaceSpecialCharacters();
publishPact(pactFolder + '/ui-article.json');

/**
 * Veröffentlicht die Pacts auf dem Pact Broker.
 */
function publishPact(filename) {
  let options = {
    pactFilesOrDirs: [filename],
    pactBroker: BROKER_URL,
    consumerVersion: project.version,
    tags: [tag]

    // aktuell erfordert der Pact Broker keine Credentials
    // pactBrokerUsername: <String>,
    // pactBrokerPassword: <String>,
  };

  pact.publishPacts(options).then(function () {
    console.log("Pact " + filename + " successfully published with the tag '" + tag + "'!");
  }, function () {
    console.log("Error while publishing pact " + filename + "!");
  });
}

/**
 * Ersetzt Sonderzeichen in den Pact-Files, mit denen Pact-Node nicht zurechtkommt.
 */
function replaceSpecialCharacters() {
  var fs = require('fs');
  var files = fs.readdirSync(pactFolder);
  files.forEach(function (file) {
    file = pactFolder + '/' + file;
    var data = fs.readFileSync(file, 'utf8');
    var result = data.replace(/€/g, '\\u20ac');
    fs.writeFileSync(file, result, 'utf8');
  });
}
