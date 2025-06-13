FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install 

# Build Vite app (uses .env.production by default when NODE_ENV=production)
ENV NODE_ENV=production

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]