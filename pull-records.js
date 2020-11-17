const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")

const airtableApiKey = process.argv[2]

const directory = path.join(__dirname, `/records`)
!fs.existsSync(directory) && fs.mkdirSync(directory)

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
        console.log(`Count: ${page.records.length} Offset: ${page.offset}`)
        await sleep(250)
    }

    return { records }
}

fetchAllData().then(jsonRes => {
    const directory = path.join(__dirname, `/timestamps`)
    !fs.existsSync(directory) && fs.mkdirSync(directory)

    // const latestPath = path.join(__dirname, `/timestamps/latest.json`)
    // if (fs.existsSync(latestPath)) {
    //     const timestamp = Date().toString().replace(/[\W_]+/g, "")
    //     const newPath = path.join(__dirname, `/timestamps/old-${timestamp}.json`)
    //     fs.renameSync(latestPath, newPath)
    // }

    // fs.writeFileSync(latestPath, JSON.stringify(jsonRes, null, 4))
})
