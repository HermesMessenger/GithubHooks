const app = require("express")()
const path = require("path")
const bodyParser = require("body-parser")
const { execFileSync } = require("child_process")

const port = 3000
const notifications = {
    enabled: false, 
    script: path.resolve("../Scripts/Telegram.sh")
}

app.use(bodyParser.json())

function sendMessage (message) {
    if (notifications.enabled) {
        return execFileSync(notifications.script, [message])
    }
}

app.post("/", function (req, res) {
    const json = req.body
    const event = req.header("X-GitHub-Event")

    res.sendStatus(200)

    if (event === "push") {
        const repo = json.repository.name
        const branch = json.ref.split("/")[2]
        const commitID = json.head_commit.id.substring(0, 7)
        const commitMessage = json.head_commit.message.split("\n")[0]
        console.log('Updating ' + branch + ' branch...')

        if (repo === "Hermes") {
            execFileSync("./hook.sh", [branch])
            sendMessage("[Webhook] `" + branch + "` branch updated to commit `" + commitID + "` - `" + commitMessage + "`")
            console.log('Updated ' + branch + ' branch.')
        }

    } else if (event === "release") {
        const version = json.release.tag_name
        const releaseInfo = (json.release.name).substring(9)

        sendMessage("[Webhook] Version " + version + " released!")
        sendMessage("[Webhook] Release description: '" + releaseInfo + "'")
        console.log(version + ' released!')
    }
})

app.listen(port, () => console.log("[Webhook] Running on port " + port))
