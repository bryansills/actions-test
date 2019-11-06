const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")

const airtableApiKey = process.argv[2]

const directory = path.join(__dirname, `/records`)
!fs.existsSync(directory) && fs.mkdirSync(directory)

const fetchPage = async (offset) => {
    const offsetQueryParam = !!offset ? `&offset=${offset}` : ""
    const networkResult = await fetch(
        `https://api.airtable.com/v0/appggFxxGcngfBBdz/Main?view=Grid%20view${offsetQueryParam}`,
        {
            "headers": {
                "Authorization": `Bearer ${airtableApiKey}`
            }
        }
    )
    return await networkResult.json()
}

const fetchAllData = async () => {
    let records = []
    let offset = ""

    while (offset != null) {
        const page = await fetchPage(offset)
        records = [...records, ...page.records]
        offset = page.offset
    }

    return records
}

fetchAllData().then(jsonRes => {
    const directory = path.join(__dirname, `/timestamps`)
    !fs.existsSync(directory) && fs.mkdirSync(directory)

    const timestamp = Date().toString().replace(/[\W_]+/g, "")
    fs.writeFileSync(path.join(__dirname, `/timestamps/${timestamp}.json`), JSON.stringify(jsonRes, null, 4))
})
