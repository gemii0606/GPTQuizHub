const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: __dirname + `/.env` });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main () {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 128,
    messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: "Hello world"}],
  });
  console.log(completion);
  console.log("======================================================");
  console.log(completion.data.choices[0].message);
}
main();
