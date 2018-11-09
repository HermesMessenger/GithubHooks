const express = require('express');
const app = express();
const execFile = require('child_process').execFile;
const port = 3000;

console.log('-------------------------------')

////
app.post('/', function(req, res) {
    console.log("Received POST");
    res.status(200).send('OK');
    console.log('Updating...')
    execFile("./hook.sh", function(error, stdout, stderr) {
        console.log('Server updated.');
    });
});

app.listen(port, function(){
  console.log('listening on localhost:3000');
});
