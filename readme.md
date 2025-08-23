I installed express ioredis pg (-g nodemon) prisma dotenv 
I then ran npx prisma init which then created a prisma folder for updating your model, and an env with databaseUrl which I updated to an actual db url which I created from running postgres in another terminal: steps:psql -h localhost -p 5432 -U $(whoami) -d postgres; CREATE ROLE myappuser WITH LOGIN PASSWORD 'mypassword';CREATE DATABASE myappdb OWNER myappuser;GRANT ALL PRIVILEGES ON DATABASE myappdb TO myappuser;
updated my env DATABASE_URL="postgresql://myappuser:mypassword@localhost:5432/myappdb?schema=public"
then ran npx prisma generate
then npx prisma migrate dev --name init
brew services start redis 
run  npx prisma studio to see your prisma db on a browser