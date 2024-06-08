# API

## Env vars
```
PORT=3000
DATABASE_URL=postgress://postgres:postgres@localhost:5432/local
NODE_ENV=development
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASS=postgres
# DB_PORT=5432
# DB_NAME=local
```

## DB Migrations 

Shell script `start.sh` can push db migrations automatically on startup. By default this is `false`.

## Start locally 

```bash
npm run dev
```