const express = require('express')
const data = require('../db/datasource')
const { fetchPath } = require('../algo/logic')
const router = express.Router()

// create devices
router.post('/devices', (req, res) => {
    const { name, type } = req.body
    if (type !== 'COMPUTER' && type !== 'REPEATER') {
        return res.status(400).send({
            error: `The device type must be an enumeration of either ‘COMPUTER’ or ‘REPEATER’`
        })
    }
    if (!data[name]) {
        data[name] = { type, targets: [] }
        res.status(201).send()
    } else {
        res.status(400).send({
            error: 'Name already exists'
        })
    }
})


//connect devices
router.post('/connections', (req, res) => {
    const { source, targets } = req.body

    if (data[source]) {
        targets.forEach((target) => {
            if (!data[source].targets.includes(target) && source !== target) {
                data[source].targets.push(target)
            }
        })
    }

    res.status(201).send()
})

//list all devices in network
router.get('/devices', (req, res) => {
    res.send(Object.keys(data))
})

//length of route between source and destination
router.get('/info-routes', (req, res) => {
    const { to, from } = req.query
    console.log(data[from].strength)
    const dist = fetchPath(from, to, data[from].strength)
    if (dist === -1) {
        return res.send({
            error: 'No route found'
        })
    } else {
        return res.send(dist)
    }

})

//setting the strength for node
router.post('/devices/:source/strength', (req, res) => {
    const { source } = req.params
    const { value } = req.body
    if (value < 0) {
        res.status(400).send({
            error: 'The strength defined for a device must be a number and it cannot be negative'
        })
    }
    data[source].strength = value
    res.status(201).send()
})

module.exports = {
    router
}