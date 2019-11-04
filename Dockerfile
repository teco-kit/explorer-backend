FROM node:10

WORKDIR /opt/aura-backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start:docker" ]
