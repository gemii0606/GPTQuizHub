# -*- coding: utf-8 -*-

import requests

url = "https://13.210.26.62/api/1.0/quizzes/create"  # Replace with the actual API URL

headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGI0YWMxMzJmNGJjNGViMzcxNmU5NSIsImlhdCI6MTY5MjA5MzE1NH0.hTIO-LJv_7jT4nPQ_t86soLo6ZGH97WqHyFHu3iCVYs",
    "Content-Type": "application/json"
}

data = {
    "article": {
        "title": "Fake Topic",
        "content": f'知識、體驗、和自我改變第三層的改變是自我的成長，來自知識和體驗對自我的衝擊。Minerva 多元的環境常常帶來很多意外，讓我不得不改變和成長。像是阿根廷政府在我上飛機的前一天，又把我的簽證記錯了第三次，電話也打不通。我在舊金山的租約已經到期，害我不知道下一週、下個月該何去何從，這時候該怎麼辦？學習除了採取緊急應變措施以外，練習想像去不了、沒有同學們的生活，學習在焦慮中以平常心面對。又像是當烏克蘭的同學遭逢戰爭，憂心家人戰死沙場，又和俄羅斯同學大聲吵架的時候該怎麼辦？第一層的學習可能是了解更多的政治背景，第二層的學習，是去聽烏克蘭同學他們的體驗，但是第三層的學習是練習在當同學半夜驚醒於家人死亡的噩夢時，給他們一個擁抱，練習在最困難的時刻支持彼此。當時，我看見再聰明的知識框架，在危急存亡之秋，根本沒用。我明白自己的無用與渺小，學習謙卑、學習同理、學習接受世界的不公、學習培養心裡的韌度，即便這些成長，一點也不舒服的。（我舉這些例子，是想要讓大家更容易理解，但坦白來說，我最大的改變其實來自於和同學們的生活與吵架裡的，畢竟都是枕邊人麻…….)'
    }
}

response = requests.post(url, json=data, headers=headers)

print("Response Status Code:", response.status_code)
print("Response Content:", response.json())