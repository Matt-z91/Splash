const axios = require('axios');
const fs = require('fs');
const path = require('path');
const wallpaper = require('wallpaper');
const config = require('../config.js');

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

const fetchWallpaper = async (url) => {
    url = url + `&client_id=${config.consumerKey}`;
    axios({
        method: 'GET',
        url: url
    })
    .then(res => {
        if (res.data) {
            let rand = Math.floor(Math.random() * res.data.results.length);
            const imgObj = res.data.results[rand];
            console.log(`
                "${imgObj.description}",
                username: ${imgObj.user.username},
                Full name: ${imgObj.user.first_name} ${imgObj.user.last_time},
                Profile: ${imgObj.user.links.self}
            `);
            return downloadImage(imgObj.urls.full);
        }
    })
    .then(imagePath => {
        setWallpaper(imagePath);    
    })
    .catch(error => {
        console.log(error.response);
        console.log(error.response.statusText);
    });
};


if (true) { // enable/disable convinence
    if (process.argv.length > 0) {
        let args = process.argv.slice(2);
        if (args.length) {
            let url = config.apiUrl + `search/photos?query=${args[0]}`;
            fetchWallpaper(url)
        } else {
            console.log('Must provide keyword to search for.');
        }
    } 
}
