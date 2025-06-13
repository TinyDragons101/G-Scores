FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

# # i want to run migrations before starting the app
# RUN npm run migration:run

# # and run seed
# RUN npm run seed


CMD ["npm", "run", "start:dev"]