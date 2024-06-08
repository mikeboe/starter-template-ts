# Project Starter with Typescript

## Create Project

```bash
# create new project
npx project-starter-ts@latest

# install deps
npm i

# start locally with docker compose
docker compose up -d
```

## Services 

### API

NodeJS and Express based API with following packages: 
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) and Drizzle Kit (Migrations preconfigured and disabled by default)
- HTTP Request logging with [morgan](https://github.com/expressjs/morgan)
- Logging with [winston](https://github.com/winstonjs/winston)
- cors, [rate-limit](https://github.com/express-rate-limit/express-rate-limit), dotenv

### Frontend

Frontend based on VITE + TS + REACT with following packages:
- [import-meta-env](https://import-meta-env.org) for env vars during runtime 
- default VITE packages

### Docs

Docs based on Starlight + Astro. 

### Website


Frontend based on Astro with following additonal packages:
- [import-meta-env](https://import-meta-env.org) for env vars during runtime 

