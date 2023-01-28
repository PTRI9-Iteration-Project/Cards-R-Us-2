const { ConstructionOutlined } = require('@mui/icons-material');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const openaiController = {
  async createImage(req, res, next) {
    const { userPrompt } = req.body;
    try {
      const response = await openai.createImage({
        prompt: userPrompt,
        n: 4,
        size: '1024x1024',
        response_format: 'b64_json',
      });
      //response.data = [{b64_json : 'string'}},{},{},{}]
      // console.log('response object: ', response.data);
      res.locals.image = response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        return next({
          log: 'Express Error handler caught middleware error at createImage middleware',
          message: { err: error.message },
        });
      }
    }
    console.log('image generation complete');
    return next();
  },

  async createImageVariation(req, res, next) {
    const { image } = req.body;

    // console.log(image);
    let imageData = image.croppedImageUrl;

    function decodeBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      return response;
    }

    let imageBuffer = decodeBase64Image(imageData);
    // console.log('type:', typeof(imageBuffer.data));
    // console.log('response.data', imageBuffer.data)
    let image64 = imageBuffer.data;
    // console.log(image64)

    fs.writeFileSync('toAI.png', image64, { type: 'image/png' });
    try {
      const response = await openai.createImageVariation(
        fs.createReadStream(`toAI.png`),
        1,
        '1024x1024',
        'b64_json'
      );
      // console.log('response object: ', response.data);
      // console.log(response.data);
      res.locals.image = response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        return next({
          log: 'Express Error hanler caught middleware error at createVariation middleware',
          message: { err: error.message },
        });
      }
    }
    console.log('image variation generated complete');
    return next();
  },
};

module.exports = openaiController;
