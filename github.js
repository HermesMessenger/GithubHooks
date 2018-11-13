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

    var repo = json.repository.name;
    var branch = json.ref.split('/').pop();
    var commitID = (json.head_commit.id).substring(0, 7);
    var commitMessage = (json.head_commit.message).split('\n')[0];
    var commiterName = json.head_commit.author.username;


    if (repo == 'Hermes') {
        if (branch == 'master') {
            console.log("Received hook in normal branch");
            res.status(200).send('OK');
            console.log('Updating server...')
            redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Normal server is updating...' + SEPCHAR + utils.getNow());
            execFile("./hook.sh", function () {
                console.log('Server updated to commit ' + commitID);
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Normal server updated to commit #' + commitID + ' by @' + commiterName +' - ' + commitMessage + SEPCHAR + utils.getNow());
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Please reload the page in order to access the new version.' + SEPCHAR + utils.getNow())
            });

        } else if (branch == 'testing') {
            console.log("Received hook in testing branch");
            res.status(200).send('OK');
            console.log('Updating testing server...')
            redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Testing server is updating...' + SEPCHAR + utils.getNow());
            execFile("./hook-testing.sh", function () {
                console.log('Testing server updated to commit ' + commitID);
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Testing server updated to commit #' + commitID + ' by @' + commiterName +' - ' + commitMessage + SEPCHAR + utils.getNow());
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Please access that page ( https://hermesmessenger-testing.duckdns.org ) in order to see the new version.' + SEPCHAR + utils.getNow())
            });
        } else {
            res.status(304).send('Wrong branch');
        };

    } else {
        res.status(409).send('Wrong repo');
    }
});

app.listen(port, () => console.log('Running GitHub Webhooks on port ' + port + '.'))

