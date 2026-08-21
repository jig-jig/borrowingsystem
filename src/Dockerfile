FROM node:18-alpine
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# --host flag forces Vite to open port interfaces to your local area network (LAN) 
# this allows you to access it with your mobile phone camera during local test runs!
CMD ["npm", "run", "dev", "--", "--host"]
