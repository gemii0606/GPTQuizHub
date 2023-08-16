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

const requestJson = (prompt, jsonStructure) => `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}`;

const text = `
New Zealand scrapped the last of its Covid restrictions Tuesday, bringing the final curtain down on one of the world’s strictest pandemic policies as the government said the country suffered a far lower mortality rate than many other nations.

Health Minister Ayesha Verrall said the island nation was ending its remaining seven-day mandatory isolation rule for those who test positive for the coronavirus as well as mandatory masks in health care facilities from midnight on Tuesday.

New Zealand was something of a poster child for how nations could successfully fend off the coronavirus when it first hit in 2020, ordering early lockdowns and strict border measures.

The early zero-Covid strategy significantly reduced the initial impact of the coronavirus outbreak, sparing New Zealand the widespread deaths and overloaded health care systems seen across much of the globe, including in the United States.

But it also kept the island nation closed off internationally and became increasingly unpopular as the rules dragged on and took a toll on the economy.

“It has been a long road, however thanks to lots of hard work, New Zealand’s COVID-19 approach has moved from an emergency response to sustainable long-term management,” Verrall said in a statement Monday.

`;

const template = {
   "question": {
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
    }
}


async function main() {
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
}

main().catch(error => {
  console.error("Error:", error);
});

/*

const reply = {
    role: 'assistant',
    content: '{\n' +
      '  "id": "1",\n' +
      '  "created_at": "2021-10-01 10:00:00",\n' +
      '  "questions": [\n' +
      '    {\n' +
      '      "id": "1",\n' +
      '      "difficulty": "easy",\n' +
      '      "type": "multiple choice",\n' +
      '      "question": "Docker的基本哲學是什麼？",\n' +
      '      "options": [\n' +
      '        {\n' +
      '          "id": "1",\n' +
      '          "value": "Build and Ship any Application Anywhere"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "2",\n' +
      '          "value": "Run Applications in Virtual Machines"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "3",\n' +
      '          "value": "Develop Applications without Infrastructure"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "4",\n' +
      '          "value": "Build and Ship any Application on Docker Hub"\n' +
      '        }\n' +
      '      ],\n' +
      '      "correct_answer": {\n' +
      '        "id": "1",\n' +
      '        "value": "Build and Ship any Application Anywhere"\n' +
      '      },\n' +
      '      "explanation": "Docker的基本哲學是讓你可以建置任何應用程式並運行在任何地方，提供了一個更快速建立和發佈應用程式的方法。"\n' +
      '    },\n' +
      '    {\n' +
      '      "id": "2",\n' +
      '      "difficulty": "difficult",\n' +
      '      "type": "multiple choice",\n' +
      '      "question": "Docker與虛擬主機的不同之處在於？",\n' +
      '      "options": [\n' +
      '        {\n' +
      '          "id": "1",\n' +
      '          "value": "Docker運行在虛擬機器上"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "2",\n' +
      '          "value": "Docker需要安裝虛擬機器監視器"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "3",\n' +
      '          "value": "Docker運行在宿主機的核心"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "4",\n' +
      '          "value": "Docker需要虛擬機器來模擬作業系統"\n' +
      '        }\n' +
      '      ],\n' +
      '      "correct_answer": {\n' +
      '        "id": "3",\n' +
      '        "value": "Docker運行在宿主機的核心"\n' +
      '      },\n' +
      '      "explanation": "Docker與虛擬主機不同，它運行在宿主機的核心，而不需要模擬整個作業系統，這使得Docker更輕量且啟動更快。"\n' +
      '    },\n' +
      '    {\n' +
      '      "id": "3",\n' +
      '      "difficulty": "normal",\n' +
      '      "type": "multiple choice",\n' +
      '      "question": "Docker的好處之一是什麼？",\n' +
      '      "options": [\n' +
      '        {\n' +
      '          "id": "1",\n' +
      '          "value": "提供一致性的發佈環境"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "2",\n' +
      '          "value": "節省硬體資源"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "3",\n' +
      '          "value": "可攜性發佈和按需式縮放"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "4",\n' +
      '          "value": "支援軟體定義網路"\n' +
      '        }\n' +
      '      ],\n' +
      '      "correct_answer": {\n' +
      '        "id": "1",\n' +
      '        "value": "提供一致性的發佈環境"\n' +
      '      },\n' +
      '      "explanation": "Docker可以提供開發和發佈統一的標準環境，有助於持續性整合和發佈工作流程。開發者和其他部門都可以在容器中運行應用程式，確保一致性並加快應用程式的發佈速度。"\n' +
      '    },\n' +
      '    {\n' +
      '      "id": "4",\n' +
      '      "difficulty": "normal",\n' +
      '      "type": "multiple choice",\n' +
      '      "question": "Docker的可攜性發佈和按需式縮放是指什麼？",\n' +
      '      "options": [\n' +
      '        {\n' +
      '          "id": "1",\n' +
      '          "value": "在不同環境中運行容器"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "2",\n' +
      '          "value": "可以動態調整應用程式的實體數量"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "3",\n' +
      '          "value": "在同一台機器運行多個容器"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "4",\n' +
      '          "value": "代碼控制基礎設施和網路"\n' +
      '        }\n' +
      '      ],\n' +
      '      "correct_answer": {\n' +
      '        "id": "2",\n' +
      '        "value": "可以動態調整應用程式的實體數量"\n' +
      '      },\n' +
      '      "explanation": "Docker的可攜性使得應用程式可以輕鬆地在不同環境中運行，而按需式縮放則使得可以根據需求動態調整應用程式的實體數量，以提供更高的彈性和效能。"\n' +
      '    },\n' +
      '    {\n' +
      '      "id": "5",\n' +
      '      "difficulty": "difficult",\n' +
      '      "type": "multiple choice",\n' +
      '      "question": "什麼是基礎設施即代碼(Infrastructure as Code)？",\n' +
      '      "options": [\n' +
      '        {\n' +
      '          "id": "1",\n' +
      '          "value": "將程式碼儲存基礎設施的設定和進行版本控制"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "2",\n' +
      '          "value": "使用Docker Compose File和Swarm控制容器的協同運作和網路"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "3",\n' +
      '          "value": "使用Docker的REST API和Docker CLI控制Docker物件"\n' +
      '        },\n' +
      '        {\n' +
      '          "id": "4",\n' +
      '          "value": "修正容器內部程式碼的方式"\n' +
      '        }\n' +
      '      ],\n' +
      '      "correct_answer": {\n' +
      '        "id": "1",\n' +
      '        "value": "將程式碼儲存基礎設施的設定和進行版本控制"\n' +
      '      },\n' +
      '      "explanation": "基礎設施即代碼是指將基礎設施的設定和配置以程式碼的方式儲存，並進行版本控制。這使得基礎設施可以像軟體一樣進行管理和部署，增加了靈活性和可追蹤性。"\n' +
      '    }\n' +
      '  ]\n' +
      '}'
  }


const quiz = JSON.parse(reply.content)
console.log(quiz)

*/

/*

幫我針對這篇文章的內容出一份測驗，總共5題選擇題，一題4個選項。2題困難，1題簡單，2題普通，每一題要標註題目難易度和題型和正確答案和答案解釋。回答語言請與輸入的語言相同。不要其他多餘的回答，幫我轉成JSON的格式顯示
json格式並以下列形式輸出。

{
    questions:[
        id: id,
        difficulty: (easy, medium, hard),
        type:(multiple chioce),
        question: `string`
        options:[
            {...}
        ]
    ]
}

*/