FROM node:alpine

ARG JWT_SECRET

ARG DATABASE_URL

ENV JWT_SECRET=${JWT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV APP_PORT=3000

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./.docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE $APP_PORT 

CMD [ "sh","/entrypoint.sh" ]



