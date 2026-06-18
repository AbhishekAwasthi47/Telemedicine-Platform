FROM node:18-alpine

# I hope I'm doing this right, stackoverflow said alpine is smaller
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Remember to expose the port, forgot this last time!
EXPOSE 5000

CMD ["npm", "start"]
