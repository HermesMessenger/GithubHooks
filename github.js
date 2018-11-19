const express = require('express');
const bodyParser = require('body-parser');
const redis = require("redis").createClient();
const utils = require('./utils');
const app = express();
const execFile = require('child_process').execFile;
const port = 3000;
const SEPCHAR = String.fromCharCode(0x1);

app.use(bodyParser.json());

console.log('---------------------------------------------')

app.post('/', function (req, res) {

  var json = req.body;
  var event = req.header('X-GitHub-Event');

  if (event == 'push') {

    var repo = json.repository.name;
    var branch = json.ref.split('/');
    var commitID = (json.head_commit.id).substring(0, 7);
    var commitMessage = (json.head_commit.message).split('\n')[0];
    var commiterName = json.head_commit.author.username;

    if (repo == 'Hermes') {
      if (branch[2] == 'master') { // To master branch
        console.log("Received hook in normal branch");
        res.status(200).send('OK');
        console.log('Updating server...')
        redis.rpush('messages', 'Admin Bot' + SEPCHAR + 'Normal server is updating...' + SEPCHAR + utils.getNow());
        execFile("./hook.sh", function () {
          console.log('Server updated to commit ' + commitID);
          redis.rpush('messages', 'Admin Bot' + SEPCHAR + 'Normal server updated to commit #' + commitID + ' by @' + commiterName + ' - ' + commitMessage + SEPCHAR + utils.getNow());
        });

      } else if (branch[2] == 'testing') { // To testing branch
        console.log("Received hook in testing branch");
        res.status(200).send('OK');
        console.log('Updating testing server...')
        redis.rpush('messages', 'Admin Bot' + SEPCHAR + 'Testing server is updating...' + SEPCHAR + utils.getNow());
        execFile("./hook-testing.sh", function () {
          console.log('Testing server updated to commit ' + commitID);
          redis.rpush('messages', 'Admin Bot' + SEPCHAR + 'Testing server updated to commit #' + commitID + ' by @' + commiterName + ' - ' + commitMessage + SEPCHAR + utils.getNow());
        });

      } else res.status(403).send('Wrong branch'); // Forbidden
    } else res.status(403).send('Wrong repo'); // Forbidden

  } else if (event == 'release') {

    var version = json.release.tag_name;
    var releaseInfo = (json.release.name).substring(9);

    res.status(200).send('OK');
    console.log('New release: ' + version);
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + ' ' + SEPCHAR + utils.getNow())
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + '-----------------------------------------------------' + SEPCHAR + utils.getNow())
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + '  New version of the website released (' + version + ')!' + SEPCHAR + utils.getNow())
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + '  Release description - ' + releaseInfo + SEPCHAR + utils.getNow())
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + '-----------------------------------------------------' + SEPCHAR + utils.getNow())
    redis.rpush('messages', 'Admin Bot' + SEPCHAR + ' ' + SEPCHAR + utils.getNow())
  };
});

app.listen(port, () => console.log('Running GitHub Webhooks on port ' + port + '.'))

