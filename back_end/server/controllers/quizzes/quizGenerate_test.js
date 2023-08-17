const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: __dirname + `/../../.env` });

const requestJson = (prompt, jsonStructure) => `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}, do not generate id for each question, do not repeat the template`;

const template = {
   "questions": [{
    "difficulty": "easy, medium, difficult",
    "type": "multiple questions",
    "question": "question",
    "options":
      [ "option",
      "option",
      "option",
      "option" ],
    "correct_answer": 1,
    "explanation": "explanation"
    }]
}

async function quizGenerate(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  console.log(req.body.text)

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "你是位專業的出題老師"},
      {
        role: "user", 
        content: requestJson(
            `
            ${req.body.text}
            :::
            幫我針對這篇文章的內容出一份測驗，總共5題選擇題，一題4個選項。2題困難，1題簡單，2題普通，每一題要標註題目難易度和題型和正確答案和答案解釋。回答語言請與輸入的語言相同。不要其他多餘的回答。
            請用JSON的格式回覆我，並且有id、difficulty、type、question、options、correct_answer、explanation
        `, template)
      }
    ],
  });

  console.log(completion.data.choices[0].message);
  console.log(JSON.parse(completion.data.choices[0].message.content))
  res.status(200).json(JSON.parse(completion.data.choices[0].message.content))
}

module.exports = {
  quizGenerate
};