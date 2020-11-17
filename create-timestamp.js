const fs = require("fs")
const path = require("path")

const directory = path.join(__dirname, `/timestamps`)
!fs.existsSync(directory) && fs.mkdirSync(directory)

// const timestamp = Date().toString().replace(/[\W_]+/g, "")
// fs.writeFileSync(path.join(__dirname, `/timestamps/${timestamp}.txt`), timestamp)
