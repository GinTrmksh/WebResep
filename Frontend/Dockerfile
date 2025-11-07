FROM node:24-alpine

WORKDIR /usr/share/app

COPY . .

RUN npm install -g http-server

EXPOSE 3000

CMD ["http-server", "-p", "3000", "."]