# Step 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /base
COPY ../package.json .
COPY ../package-lock.json .
COPY ./package.json api/package.json
RUN npm install
COPY . api

RUN npm run build --workspace=api

EXPOSE 3000

CMD ["node", "api/dist/app.js"]
# ENTRYPOINT ["sh","start.sh"]
# ENTRYPOINT ["/bin/sh"]