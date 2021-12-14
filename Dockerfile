FROM node:alpine
WORKDIR /usr/src/app/back



RUN apk update && apk upgrade
COPY . /usr/src/app
RUN cd /usr/src/app/front && yarn install 
RUN export NODE_OPTIONS=--openssl-legacy-provider && cd /usr/src/app/front && yarn build
RUN ln -s /usr/src/app/front/dist /usr/src/app/back/static

RUN export NODE_OPTIONS=--openssl-legacy-provider && cd /usr/src/app/back &&  yarn install 
RUN  yarn global add pm2 
CMD ["pm2-runtime", "index.js"]

