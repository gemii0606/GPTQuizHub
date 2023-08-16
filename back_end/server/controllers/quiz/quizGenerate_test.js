const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: __dirname + `/../../.env` });

const requestJson = (prompt, jsonStructure) => `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}, do not generate id for each question`;

const text = `
New Zealand scrapped the last of its Covid restrictions Tuesday, bringing the final curtain down on one of the world’s strictest pandemic policies as the government said the country suffered a far lower mortality rate than many other nations.

Health Minister Ayesha Verrall said the island nation was ending its remaining seven-day mandatory isolation rule for those who test positive for the coronavirus as well as mandatory masks in health care facilities from midnight on Tuesday.

New Zealand was something of a poster child for how nations could successfully fend off the coronavirus when it first hit in 2020, ordering early lockdowns and strict border measures.

The early zero-Covid strategy significantly reduced the initial impact of the coronavirus outbreak, sparing New Zealand the widespread deaths and overloaded health care systems seen across much of the globe, including in the United States.

But it also kept the island nation closed off internationally and became increasingly unpopular as the rules dragged on and took a toll on the economy.

“It has been a long road, however thanks to lots of hard work, New Zealand’s COVID-19 approach has moved from an emergency response to sustainable long-term management,” Verrall said in a statement Monday.

`;

const template = {
   "questions": [{
    "difficulty": "easy, medium, difficult",
    "type": "multiple questions",
    "question": "小梅當選班花的原因是什麼？",
    "options":
      [ "她比其他女生漂亮",
      "她發表了精彩的演說",
      "她比其他女生更有才華",
      "她讓其他女生感到自信" ],
    "correct_answer": 1,
    "explanation": "小梅的演說讓其他女生覺得因為有她，她們變得更優秀，所以她被選為班花。"
    }]
}


async function quizGenerate(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "你是位專業的出題老師"},
      {
        role: "user", 
        content: requestJson(
            `
            ${text}
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
  quizGen
};