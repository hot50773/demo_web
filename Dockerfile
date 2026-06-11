FROM node:20-slim

WORKDIR /app

COPY . .

RUN npm install --production

ENV PORT=80
EXPOSE 80

CMD ["npm", "start"]
