let model_request = {
    "heaader": true,

    // Page Request Fields
    "request_params": {
        request_id: 0,
        date: "",
        completed: 0,
        name: "",
        email: "",
        iam: "",
        description: "",
        telephone: "",
        school: "",
        feedback: 0,
        stl_file: "",
        model_size: "",
        considerations: "",
        how_found: "",
        address: "",
        label: 0
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