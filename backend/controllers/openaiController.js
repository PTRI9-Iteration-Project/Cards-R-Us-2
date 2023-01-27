const { Configuration, OpenAIApi } = require('openai');

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
          log: "Express Error handler caught middleware error at '/backend/controller/openaiController",
          message: { err: error.message },
        });
      }
    }
    console.log('image generation complete');
    return next();
  },

  async createImageVariation(req, res, next) {
    const { image } = req.body;
    try {
      const response = await openai.createImageVariation(
        fs.createReadStream(image),
        4,
        '1024x1024',
        'b64_json'
      );
      //response.data = [{b64_json : 'string'}},{},{},{}]
      // console.log('response object: ', response.data);
      res.locals.image = response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        return next({
          log: "Express Error hanler caught middleware error at '/backend/controller/openaiController",
          message: { err: error.message },
        });
      }
    }
    console.log('image variation generated complete');
    return next();
  },
};

module.exports = openaiController;
