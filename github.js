function getNow() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + "/" + month + "/" + year + "$" + hour + ":" + min + ":" + sec;

}

const express = require('express');
const bodyParser = require('body-parser');
const redis = require("redis").createClient();
const app = express();
const execFile = require('child_process').execFile;
const port = 3000;
const SEPCHAR = String.fromCharCode(0x1);


app.use(bodyParser.json());


app.post('/', function(req, res) {

    var json = req.body;

    var repo = json.repository.name;
    var branch = json.ref.split('/').pop();
    var commitID = (json.head_commit.id).substring(0,7);
    var commitMessage = json.head_commit.message;
    commitMessage = commitMessage.split('\n')[0];

    if (repo == 'Hermes') {
        if (branch == 'master') {
            console.log("Received hook in normal branch");
            res.status(200).send('OK');
            console.log ('Updating server...')

            redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Server is updating...' + SEPCHAR + getNow());

            execFile("./hook.sh", function(error, stdout, stderr) {
                console.log('Server updated to commit ' + commitID);
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Server updated to commit #' + commitID + ' - ' + commitMessage + SEPCHAR + getNow());
                redis.lpush('messages', 'Admin Bot' + SEPCHAR + 'Please reload the page in order to access the new version.' + SEPCHAR + getNow())
            });

        } else {
            res.status(500).send('Wrong branch');
        };

    } else {
        res.status(500).send('Wrong repo');
    }
});

app.listen(port, () => console.log(`Github Hooks on port ${port}!`))

