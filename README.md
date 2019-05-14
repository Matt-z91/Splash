Fetch, download and set a random desktop wallpaper from Unplash.com

1) Run npm install

2) Modify config.js; add Unsplash app id (create one at https://www.unplash.com/developers)

3) Run `node src/api.js`

Pulled images are stored in /src/walls


Possible setups

- Add several keywords to the config.js file
- Create a terminal alias, e.g, `alias cw="node /home/user/projects/splash/src/api.js` that
can be run as `cw water` , `cw japan zen garden` etc.
