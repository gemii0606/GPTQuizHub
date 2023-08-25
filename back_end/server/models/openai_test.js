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

const openaiFunctionCalling = {
  name: 'generate_questions',
  description: 'generate questions from the articles',
  parameters: {
      type: 'object',
      properties: {
          article: {
              type: "string",
              description: "Please use this article to make a quiz" //, including 1 hard, 1 medium and 1 easy problem, and return it useing the quitions format."
          },
          questions: {
              type: 'array',
              items: {
                  type: "object",
                  properties: {
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"], description: "The level corresponding to the question" },
                      type: { type: "string", enum: ["multiple question"], description: "The type of the question" },
                      question: { type: "string", description: "The question" },
                      options: { type: "array", description: "options of the questions, mostly 4" },
                      correct_answer: { type: "number", description: "The currect option of the  question." },
                      explanation: { type: "string", description: "The explanation of the correct answer," }
                  }
              }
          }
      },
      required: ['article']
  }
}

async function generate_questions(article){
  return article;
}

const article = {
  hard: 1,
  normal:0,
  hard:1
}

const total=2

async function main() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // max_tokens: 128,
    messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: `
                Article: ${article.content}
                '''
                幫我針對這篇文章的內容出一份測驗，總共${total}題選擇題，一題4個選項。${article.hard}題困難，${article.easy}題簡單，${article.normal}題普通
            `
        }
    ],
    functions: [ openaiFunctionCalling ]
  });
  
  console.log(completion.data.choices[0].message);
}

main().catch(error => {
  console.error("Error:", error);
});