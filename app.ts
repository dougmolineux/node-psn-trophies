import * as request from 'request';
import * as fs from 'fs';
import * as _ from 'lodash';
import { TrophyTitle } from './models';

const localTrophies = require('./trophies.json');

const limit = "10";

// update this value with your token
const token = "YOUR_TOKEN";

let offset = <any>"0";
let trophyTitles: Array<TrophyTitle> = [];
let totalResults = 0;

const handleResponse = (error, response, body) => {
    if(error) throw(error);
    body = JSON.parse(body);
    totalResults = <number>body.totalResults;
    trophyTitles = trophyTitles.concat(body.trophyTitles);
    offset = parseInt(offset) + parseInt(limit);
    console.log("trophyTitles.length", trophyTitles.length);
    if(trophyTitles.length === totalResults) {
        fs.writeFile('trophies.json', JSON.stringify(trophyTitles), (err) => {
            if (err) throw err;
            console.log('trophies.json has been saved!');
        });
        analyzeTrophies(trophyTitles);
    } else {
        sendRequestToSony();
    }
}

const sendRequestToSony = () => {
    if(!token) throw new Error("token is required, get one at my.playstation.com");
    request({
        url: `https://us-tpy.np.community.playstation.net/trophy/v1/trophyTitles?fields=@default,trophyTitleSmallIconUrl&platform=PS3,PS4,PSVITA&limit=${limit}&offset=${offset}&npLanguage=en`,
        headers: {
            authorization: `Bearer ${token}`
        }
    }, handleResponse);
}

const analyzeTrophies = (trophs) => {
    let platCount = 0;
    trophs.forEach(title => {
        if(title.fromUser.earnedTrophies.platinum) {
            platCount++;
            console.log("Platinum Trophy Game Title:", title.trophyTitleName);
        }
    });
    let sorted = _.sortBy(trophs, "fromUser.progress").reverse();
    console.log("Total number of Platinum Trophies:", platCount);
    console.log("Top 5 Progression Percentages: ", 
        sorted.slice(0, 5).map(t=>({
            gameTitle: t.trophyTitleName, 
            totalProgess: t.fromUser.progress+"%"
        })));
}

if(!localTrophies) sendRequestToSony();
else analyzeTrophies(localTrophies);