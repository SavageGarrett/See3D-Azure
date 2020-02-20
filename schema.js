let model_request = {
    "header": true,

    // Page Request Fields
    "request_params": {
        date: "",
        completed: 0
    },

    // Parameter 
    "request_state": {
        modelsWanted: {
            available: [
            {
                "model_links": ["thingiverse links"],
                "model_count": [],
                "assigned_users": [{
                    "user_id": "",
                    "": ""
                }],
                "assigned_designer": "name",
                "completed": 24
            }],
            design_request: [{
                "assigned_users": [{}],
                "description": "description",
                "model_link": "thingiverse upload link",
                "request_id": 0
            }], 
            complete_date: "date to complete by"
        }
    },
}

module.exports = model_request;