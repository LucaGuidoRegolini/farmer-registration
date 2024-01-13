FROM node:alpine

ARG JWT_SECRET

ARG DATABASE_URL

ARG APP_PORT

ENV JWT_SECRET=${JWT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV APP_PORT=${APP_PORT}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./.docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE $APP_PORT 

CMD [ "sh","/entrypoint.sh" ]



