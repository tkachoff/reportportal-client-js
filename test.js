'use strict';

var Service = require("./lib/client.js");

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
    endpoint: "http://ecsc001053dd.epam.com:8080",
    project: "js-client",
    token: "91685c75-b6e9-415b-b4d1-ddc29fca35e4"
};

// var rpConfig = {
//     endpoint: "https://rp.epam.com",
//     project: "default_project",
//     token: "cd00c5d1-f94f-4c4f-bf9d-86f4989f354c"
// };

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
            message: "logmessage",
            level: "TRACE"
        };
        var postLogResponse = rp.log(saveLogRQ);
        postLogResponse.then(function (data) {
            console.log(data);
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





