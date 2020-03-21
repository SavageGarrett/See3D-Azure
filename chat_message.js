const axios = require('axios')
let chat_message = {
    send_message: (hook, blocks) => {
        axios.post(hook, blocks)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    print_accept: {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "New Model Request:\n*<thingiverse.com|Fred Enriquez - New device request>*"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Accept"
                        },
                        "style": "primary",
                        "value": "click_me_123"
                    }
                ]
            }
        ]
    },

    request_help_admin: {
        "blocks": [
        {
            "type": "section",
            "text": {
            "type": "mrkdwn",
            "text": '/requests command help'
            }
        },
        {
            type: "divider"
        },
        {
            "type": "section",
            "fields": [
            {
                "type": "plain_text",
                "text": "/requests get-current",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "Shows unfulfilled model requests",
                "emoji": true
            }
            ,
            {
                "type": "plain_text",
                "text": "/requests add-printer {request id} {user @}",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "Adds printer user to a request",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "/requests add-designer {request id} {user @}",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "Adds designer user to a request",
                "emoji": true
            }
            ]
        }
        ]
    },

    request_help_printer: {
    
    },
    
    request_help_designer: {
    
    },

    register_help: {
        "blocks": [
        {
            "type": "section",
            "text": {
            "type": "mrkdwn",
            "text": '/register command help'
            }
        },
        {
            type: "divider"
        },
        {
            "type": "section",
            "fields": [
            {
                "type": "plain_text",
                "text": "/register {@user} admin",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "Makes {@user} an admin. Admin users can see all request information :smile:",
                "emoji": true
            }
            ]
        }
        ]
    }
}

module.exports = chat_message;