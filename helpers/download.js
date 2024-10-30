const fs = require('fs');
const Axios = require('axios')

async function download(url, filepath) {
  try {
    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath));
    });
  }
  catch {
    return null
  }
}

module.exports = download