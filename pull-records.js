const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")

const directory = path.join(__dirname, `/records`)
!fs.existsSync(directory) && fs.mkdirSync(directory)

const fetchPage = async (offset) => {
    const offsetQueryParam = !!offset ? `&offset=${offset}` : ""
    const networkResult = await fetch(
        `https://api.airtable.com/v0/appggFxxGcngfBBdz/Main?view=Grid%20view${offsetQueryParam}`,
        {
            "headers": {
                "Authorization": "Bearer keyR7Yl2PVWG9daU9"
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
    const timestamp = Date().toString().replace(/[\W_]+/g, "")
    fs.writeFileSync(path.join(__dirname, `/timestamps/${timestamp}.json`), JSON.stringify(jsonRes, null, 4))
})
