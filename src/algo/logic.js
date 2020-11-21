const Queue = require('./queue')
const data = require('../db/datasource')

const fetchPath = (source, dest, strength = 5) => {
    if (source === dest) {
        return 0
    }

    let distance = 0
    const nodes = Object.keys(data)
    const visited = {}
    nodes.forEach((node) => {
        visited[node] = false
    })

    const queue = new Queue()
    if (data[source]) {
        if (data[source].type === 'REPEATER') {
            strength = strength * 2
        }
        visited[source] = true
        queue.enqueue(source)


        while (!queue.isEmpty()) {
            let size = queue.size()
            if (strength <= 0) {
                return -1
            }

            while (size > 0 && strength > 0) {
                const node = queue.dequeue()
                if (data[node].type === 'REPEATER') {
                    strength = strength * 2
                }

                const childList = data[node].targets
                for (let i = 0; i < childList.length; i++) {
                    const child = childList[i]
                    if (child === dest) {
                        return ++distance
                    }
                    if (!visited[child]) {
                        queue.enqueue(child)
                        visited[child] = true
                    }
                }
                size--
            }
            strength--
            distance++
        }
        return -1
    } else {
        return -1
    }
}


module.exports = {
    fetchPath
}