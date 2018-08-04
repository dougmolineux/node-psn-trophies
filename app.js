"use strict";
exports.__esModule = true;
var request = require("request");
var fs = require("fs");
var _ = require("lodash");
var localTrophies = require('./trophies.json');
var limit = "10";
// update this value with your token
var token = "YOUR_TOKEN";
var offset = "0";
var trophyTitles = [];
var totalResults = 0;
var handleResponse = function (error, response, body) {
    if (error)
        throw (error);
    body = JSON.parse(body);
    totalResults = body.totalResults;
    trophyTitles = trophyTitles.concat(body.trophyTitles);
    offset = parseInt(offset) + parseInt(limit);
    console.log("trophyTitles.length", trophyTitles.length);
    if (trophyTitles.length === totalResults) {
        fs.writeFile('trophies.json', JSON.stringify(trophyTitles), function (err) {
            if (err)
                throw err;
            console.log('trophies.json has been saved!');
        });
        analyzeTrophies(trophyTitles);
    }
    else {
        sendRequestToSony();
    }
};
var sendRequestToSony = function () {
    if (!token)
        throw new Error("token is required, get one at my.playstation.com");
    request({
        url: "https://us-tpy.np.community.playstation.net/trophy/v1/trophyTitles?fields=@default,trophyTitleSmallIconUrl&platform=PS3,PS4,PSVITA&limit=" + limit + "&offset=" + offset + "&npLanguage=en",
        headers: {
            authorization: "Bearer " + token
        }
    }, handleResponse);
};
var analyzeTrophies = function (trophs) {
    var platCount = 0;
    trophs.forEach(function (title) {
        if (title.fromUser.earnedTrophies.platinum) {
            platCount++;
            console.log("Platinum Trophy Game Title:", title.trophyTitleName);
        }
    });
    var sorted = _.sortBy(trophs, "fromUser.progress").reverse();
    console.log("Total number of Platinum Trophies:", platCount);
    console.log("Top 5 Progression Percentages: ", sorted.slice(0, 5).map(function (t) { return ({
        gameTitle: t.trophyTitleName,
        totalProgess: t.fromUser.progress + "%"
    }); }));
};
if (!localTrophies)
    sendRequestToSony();
else
    analyzeTrophies(localTrophies);
