const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs');
const crypto = require('crypto');
const download = require("./helpers/download")

const PATH_TO_IMAGES = './images/';

app.get('/proxy', async (req, res) => {
  let url = req.query.url // Url to download
  let hash = crypto.createHash('md5').update(url).digest("hex"); // Create hash of url

  if (fs.existsSync(`${PATH_TO_IMAGES}${hash}.jpg`)) {
    // If file exists, send it without creating and storing it again
    res.header('Cache', "HIT"); // Set cache header to HIT
    res.sendFile(`${PATH_TO_IMAGES}${hash}.jpg`, { root: "." }, () => {
    })  // Send back the image to the user
  }
  else {
    // If file doesn't exist, create it and send it
    await download(url, `${PATH_TO_IMAGES}${hash}.jpg`);  // Download the file into the folder
    res.sendFile(`${PATH_TO_IMAGES}${hash}.jpg`, { root: "." }, () => {
    })  // Send back the image to the user
  }
})

// Basic heartbeat route to check if server is running
app.get('/', async (req, res) => {
  res.send("The server is running correctly.")
})

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});