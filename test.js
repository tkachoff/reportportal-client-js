'use strict';

var Service = require("./lib/client.js");
var fs = require('fs');
// var q = require('q');

function now() {
    return new Date().getTime();
}

var status = {
    PASSED: 'passed',
    FAILED: 'failed',
    SKIPPED: 'skipped'
};

var rpConfig = {
    endpoint: "https://rp_url",
    project: "project_name",
    token: "user_token"
};

var rp = new Service(rpConfig);

var startLaunchRQ = {
    name: "JSLaunchName",
    description: "Some LaunchDescription",
    tags: ["tag1", "tag2"],
    start_time: now(),
    mode: null
};

var startLaunchResponse = rp.startLaunch(startLaunchRQ);

var launchId;

startLaunchResponse.then(function (response) {
    var startTestItemRQ = {
        name: "Test1",
        description: "TestDescription",
        tags: ["tag1", "tag2"],
        start_time: now(),
        launch_id: response.id,
        type: "TEST"
    };
    var startTestResponse = rp.startTestItem(null, startTestItemRQ);
    startTestResponse.then(function (data) {
        var testItemId = data.id;
        var saveLogRQ = {
            item_id: testItemId,
            time: now(),
            message: "logmessage"
            // level: "TRACE"
        };
        var contents = fs.readFileSync("image.jpg", 'base64');
        var postLogResponse = rp.sendFile(saveLogRQ, "image.jpg", contents, "image/jpg");
        postLogResponse.then(function (data) {
            // console.log(data);
            var finishTestItemRQ = {
                end_time: now(),
                status: status.PASSED
            };
            rp.finishTestItem(testItemId, finishTestItemRQ).then(function (data) {
                var finishExecutionRQ = {
                    end_time: now(),
                    status: status.PASSED
                };
                startLaunchResponse.then(function (response) {
                    console.log(response.id);
                    rp.finishLaunch(response.id, finishExecutionRQ)
                        .then(function (data) {
                            console.log(data);
                        })
                }, function (err) {
                    console.log(err);
                });
            });
        });
    })
});

// console.log(launchId);

// var startTestItemRQ = {
//     name: "Suite1",
//     description: "SuiteDescription",
//     tags: ["suite_tag1", "suite_tag2"],
//     start_time: now(),
//     launch_id: launchId,
//     type: "SUITE"
// };

// var startSuiteResponse = rp.startTestItem(null, startTestItemRQ);

// startSuiteResponse.then(function(data){
//     var finishTestItemRQ = {
//         end_time : now(),
//         status : status.PASSED
//     }
//     rp.finishTestItem(data.id, finishTestItemRQ);
// })





