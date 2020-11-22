const fs = require('fs')

const filecontent = fs.readFileSync('./src/db/data.json', { encoding: 'utf-8' })

// const data = {}
const data = JSON.parse(filecontent)
module.exports = data