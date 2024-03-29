FROM node:latest

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy SSL certificates
COPY cert.pem /usr/src/app/cert.pem
COPY key.pem /usr/src/app/key.pem

EXPOSE 443

CMD ["npm", "start"]