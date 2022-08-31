//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/webrtc'));

// app.get('/*', (req, res) =>
//     res.sendFile('index.html', {root: 'dist/webrtc/'}),
// );
app.all('*', (req, res) => {
    res.status(200).sendFile(__dirname + '/dist/project-folder/index.html');
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);