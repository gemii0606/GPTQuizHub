// const { Configuration, OpenAIApi } = require("openai");
// require('dotenv').config({ path: __dirname + `/../../.env` });

// console.log(process.env.OPENAI_API_KEY)
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// const completion = openai.createChatCompletion({
//   model: "gpt-3.5-turbo",
//   messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: "Hello world"}],
// }).then().catch(error => {console.error("Error:", error);
// });

// console.log(completion)
// console.log(completion.data.choices[0].message);

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: __dirname + `/../../.env` });

async function main() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {role: "user", content: "I don't want to go to school"}
    ],
  });
  
  console.log(completion.data.choices[0].message);
}

main().catch(error => {
  console.error("Error:", error);
});