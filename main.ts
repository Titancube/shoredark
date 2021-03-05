import { Client } from '@typeit/discord'
import * as dotenv from 'dotenv'

dotenv.config()

async function start() {
    const client = new Client({
        classes: [
            `./*.ts`
        ],
        silent: false,
        variablesChar: "$"
    })

    await client.login(process.env.BOT_TOKEN)
}

start()