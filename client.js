'use strict';

var rest = require('restler');

class RPClient{
    constructor(params){
        this.baseURL = [params.endpoint, "api/v1", params.project].join("/");
        this.options = {
            headers: {
            "User-Agent": 'NodeJS',
            "Authorization": `bearer ${params.token}`
            }
        }
    }

    _getResponsePromise(url, rq, options, method){
        var response = function(resolve, reject){
            rest.json(url, rq, options, method)            
            .on("success", function(data) {
                resolve(data);                       
            })
            .on("fail", function(data) {
                reject(data);                       
            })
            .on("error", function(data) {
                reject(data);                       
            });
        }
        return new Promise(response);
    }

    startLaunch(startLaunchRQ) {
        var url = [this.baseURL, "launch"].join("/");
        return this._getResponsePromise(url, startLaunchRQ, this.options, "POST");
    }

    finishLaunch(launchID, finishExecutionRQ) {
        var url = [this.baseURL, "launch", launchID, "finish"].join("/");
        return this._getResponsePromise(url, finishExecutionRQ, this.options, "PUT");
    }

    startTestItem(parentItemId, startTestItemRQ) {
        if (parentItemId == null) {
            var url = [this.baseURL, "item", parentItemId].join("/");
        } else {
            var url = [this.baseURL, "item"].join("/");
        }
        return this._getResponsePromise(url, startTestItemRQ, this.options, "POST");
    }

    finishTestItem(itemId, finishTestItemRQ) {
        var url = [this.baseURL, "item", itemId].join("/");
        return this._getResponsePromise(url, finishTestItemRQ, this.options, "PUT");
    }

    log(saveLogRQ) {
        var url = [this.baseURL, "log"].join("/");
        return this._getResponsePromise(url, saveLogRQ, this.options, "POST");
    }
}

module.exports = RPClient;