const axios = require('axios');
const fs = require('fs');
const path = require('path');
const wallpaper = require('wallpaper');
const config = require('../config.js');

if (true) { // enable/disable convinence

    let url = config.apiUrl + `photos/?client_id=${config.consumerKey}`;
    
    if (config.collections.length) {
        url += '&'
        config.collections.map((term, i, arr) => {
            url += term;
            if (arr.length - 1 !== i) {
                url += ','
            }
        });
    }

    axios({
        method: 'GET',
        url: url
    })
    .then(res => {
        if (res.data) {
            let imageObj = res.data[Math.floor(Math.random() * res.data.length)];
            let url = imageObj.urls.full;
            return downloadImage(url);
        }
    })
    .then(imagePath => {
        setWallpaper(imagePath);    
    })
    .catch(error => {
        console.log(error);
    });
}

const downloadImage = async (url) => {
    const imagePath = path.resolve(__dirname, 'walls', 'bg.jpg');
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
    });

    if (response.data) {
        response.data.pipe(writer);
    }

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve(imagePath));
        writer.on('error', reject(false));
    });
}

// set current wallpaper
const setWallpaper = async (filePath) => {
    return await wallpaper.set(filePath);
};




