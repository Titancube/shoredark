# Shoredark

A private Discord bot

## This bot uses

- Node.js 14 LTS (Hosted on GCP)
- Discord.js@12
- Typescript
- Firebase
- pm2

## Installation & running

### Installation

```node
// Installs dependencies (including pm2)
yarn

// Installs typescript support for pm2
pm2 install typescript
```

### Run

```node
// Run
yarn start

// Run & keep it alive
pm2 start shoredark.ts
```

## Setting up details

### Firebase

You need a `serviceAccount.json` to run this bot on GCP inside `/static/`
Check the [official guide of Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)

### .env

make `.env` on root with your bot's client token

```env
CLIENT_TOKEN=<YOUR_BOT_TOKEN>
```
