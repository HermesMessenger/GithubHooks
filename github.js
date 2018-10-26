const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var execFile = require('child_process').execFile;
app.use(bodyParser.json());
////
const port = 3000;
var repo = 'Codernauts/social-network';
var branch = 'master';

app.post('/', function(req, res) {
    var json = req.body;
    var branch_ = json.ref.split('/').pop();
    var repo_ = json.repository.full_name;
    if(repo_ == repo && branch_ == branch)
    {
         console.log("OK");
         res.status(200).send('OK');
         execFile('./hook.sh', function(error, stdout, stderr) {
         console.log('Ejecutado');
      });
    }
    else
    {
        res.status(500).send('KO');  
    }
});

app.listen(port, () => console.log(`Github Hooks on port ${port}!`))
