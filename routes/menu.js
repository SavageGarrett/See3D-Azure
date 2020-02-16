var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');

router.post('/menu', (req, res) => {
    console.log(req.params)
    res.send({
        "options": [
            {
            "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*"
            },
            "value": "value-0"
            },
            {
            "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*"
            },
            "value": "value-1"
            },
            {
            "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*"
            },
            "value": "value-2"
            }
        ]
    })
})

module.exports = router;