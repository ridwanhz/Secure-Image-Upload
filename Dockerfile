FROM node:18
WORKDIR /app
COPY . .
RUN chmod +x wait-for-it.sh
RUN npm install
CMD ["./wait-for-it.sh", "db:5432", "--", "node", "app.js"]
