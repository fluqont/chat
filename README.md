# chat

A simple chat app available at [chat.sinskiy.website](https://chat.sinskiy.website/)

> [!WARNING]
> I use free tier of Render and server spins down after a period of inactivity, so you'll probably have to wait for about 30 seconds before you can use the website

## Features

- sign up with username and password, log in, upload profile picture, change username, delete account
- search other users by username, send them friend requests, delete incoming and outcoming friend requests
- see if your friends are online
- send messages, send attachments, update messages
- create groups, invite friends to groups, delete groups, delete incoming group requests
- receive messages and status updates in real time

## Built with

### Frontend

TypeScript, Vite, React, React Router, WebSocket, Vitest, testing-library, CSS modules

### Backend

Node.js, TypeScript, Express, PrismaORM, ws, PostgreSQL, Jest, supertest

### Deployed on

[chat.sinskiy.website](https://chat.sinskiy.website/) - [Vercel](https://vercel.com)

[api.chat.sinskiy.website](https://api.chat.sinskiy.website/api) - [Render](https://render.com)

Database - [Neon](https://neon.tech)

Images - [Supabase](https://supabase.com)

## Build

1.

```bash
git clone git@github.com:sinskiy/chat.git
cd chat
cd client && npm install
cd ../server && npm install
```

2. fill all .env by .env.example

3.

### First terminal (/server)

```bash
npm run start
```

### Second terminal

```bash
cd ../client
npm run dev
```
