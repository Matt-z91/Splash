const axios = require('axios');
const fs = require('fs');
const path = require('path');
const wallpaper = require('wallpaper');
const config = require('../config.js');

const searchCollection = async (query) => {
    const url = `${config.apiUrl}search/collections?page=1&per_page=1&query=${query}&client_id=${config.consumerKey}`;
    return await axios({
        method: 'GET',
        url: url,
    })
    .catch(error => {
        console.log('searchCollection error: ');
        console.log(error.response.statusText);
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

const fetchWallpaper = async (url) => {
    url = url + `client_id=${config.consumerKey}`;
    axios({
        method: 'GET',
        url: url
    })
    .then(res => {
        if (res.data) {
            let url = '';
            if (res.data.length > 0) {
                let imageObj = res.data[Math.floor(Math.random() * res.data.length)];
                url = imageObj.urls.full;
            } else {
                url = res.data.urls.full;
            }
            return downloadImage(url);
        }
    })
    .then(imagePath => {
        setWallpaper(imagePath);    
    })
    .catch(error => {
        console.log(error);
    });
};


if (true) { // enable/disable convinence
    let url = config.apiUrl + `photos/random`;
    let ids = [];

    if (process.argv.length > 0 || config.collections.length > 0) {
        let findCollections = [];
        let args = process.argv.slice(2);
        if (args.length) {
            findCollections = args;
        } else {
            findCollections = config.collcetions;
        }

        if (findCollections.length) {
            let collectionRequests = [];
            for (let i = 0; i <= findCollections.length; i++) {
                collectionRequests.push(searchCollection(findCollections[i]));
            }
            axios.all(collectionRequests)
            .then(collections => {
                collections.map(obj => {
                    ids.push(obj.data.results[0].id);
                });
                ids = ids.join(',');            
                url = url += `?collections=${ids}&`;
                fetchWallpaper(url);
            });
        } else {
            console.log('Collections are empty, please specify collection/s to search for.');
        }
    } 
    else {
        fetchWallpaper((url + '?'));
    }
}
