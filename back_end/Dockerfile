FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到容器中
COPY . /app/

EXPOSE 3000

RUN npm install -qg pm2 && npm install --only=dev

CMD pm2-runtime start app.js --name app

