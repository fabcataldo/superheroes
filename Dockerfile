FROM node:alpine

WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY . ./

CMD ["npm", "start"]