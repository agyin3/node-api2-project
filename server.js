const express = require('express')
const server = express()
server.use(express.json());

const expressRouter = require('./express-router.js')

server.use('/api/posts', expressRouter)



server.get('/', (req,res) => {
    res.send(`
        <h1>Welcome In</h1>
        <p>Epstein Didn't kill himself</p>
    `)
})

module.exports = server