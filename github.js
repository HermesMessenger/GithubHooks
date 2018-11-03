const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var execFile = require('child_process').execFile;
var json = require('./github.json');
app.use(bodyParser.json());
var configMap = {};

////
json.repos.forEach(function(item){
    configMap[item.repo] = {'folder': item.folder, 'branch': item.branch};
})

app.post('/', function(req, res) {
    var json = req.body;
    var branch_ = json.ref.split('/').pop();
    var repo_ = json.repository.full_name;
    var config = configMap[repo_];
    console.log("OK");
    res.status(200).send('OK');
    execFile("./hook.sh", function(error, stdout, stderr) {
        console.log('Ejecutado');
    });
})

app.listen(port, () => console.log(`Github Hooks on port ${port}!`))