/**
 * API Calls - Currently only Used By Template Handler
 */
const axios = require('axios')

function get_axios_promise(config) {
    return new Promise((resolve, reject) => {
        axios(config)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

module.exports = {get_axios_promise};