const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")

const directory = path.join(__dirname, `/records`)
!fs.existsSync(directory) && fs.mkdirSync(directory)

fetch(
    "https://api.airtable.com/v0/appggFxxGcngfBBdz/Main?maxRecords=50&view=Grid%20view",
    {
        "headers": {
            "Authorization": "Bearer keyR7Yl2PVWG9daU9"
        }
    }
).then(response => {
    return response.json()
}).then(jsonRes => {
    const timestamp = Date().toString().replace(/[\W_]+/g, "")
    fs.writeFileSync(path.join(__dirname, `/timestamps/${timestamp}.json`), JSON.stringify(jsonRes, null, 4))
})
