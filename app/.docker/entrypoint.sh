#!/bin/bash

npm install

npm i -g prisma

prisma generate

npm run prisma:deploy

npm run build

rm -rf src

npm run start
