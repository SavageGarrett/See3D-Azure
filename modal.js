var axios = require('axios');

let modal = {
    model_request_view: {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "Add Models ",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        blocks: [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "link_input",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Thingiverse model link"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Model"
                }//,
                // "hint": {
                //     "type": "plain_text",
                //     "text": "Hint text"
                // }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "qty_input",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Number of Models"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Quantity"
                }//, 
                // "hint": {
                //     "type": "plain_text",
                //     "text": "Hint text"
                // }
            }
        ]
    },

    design_request_view: {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "Design Request",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                }
            }
        ]
    },

    accept_print: {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": "Accept Print",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "block_id": "num-models-input",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                },
                "label": {
                    "type": "plain_text",
                    "text": "Quantity",
                    "emoji": true
                }
            }
        ]
    },

    /**
     * Open a Modal
     * 
     * @param private_metadata metadata attached to view
     * @param payload payload to get trigger id from
     * @param token bot token
     * @param view modal view to send to user
     */
    open_modal: (private_metadata, payload, token, view) => {
        console.log(private_metadata)
        axios.post("https://slack.com/api/views.open",
        {
            "trigger_id": payload.trigger_id,
            "view": {
                "private_metadata": private_metadata,
                "type": view.type,
                "title": view.title,
                "submit": view.submit,
                "close": view.close,
                "blocks": view.blocks
            }
        },
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then((res) => {
            //console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    },

    /**
     * Update a modal view
     * 
     * @param id id to store in metadata
     * @param action action to store in metadata
     * @param payload payload sent on button post
     * @param token modal id token
     * @param view view block kit
     */
    update_modal: (id, action, payload, token, view) => {
        axios.post("https://slack.com/api/views.open",
        {
            "trigger_id": payload.trigger_id,
            "view": {
                "private_metadata": JSON.stringify({_id: id, action: action}),
                "type": view.type,
                "title": view.title,
                "submit": view.submit,
                "close": view.close,
                "blocks": view.blocks
            }
        },
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then((res) => {
            //console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

module.exports = modal;