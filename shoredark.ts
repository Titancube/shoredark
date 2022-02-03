import { Intents } from 'discord.js'
import { Client } from 'discordx'
import * as dotenv from 'dotenv'
import { Logger } from './plugins/tools'
dotenv.config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  silent: false,
})

client.on('ready', async () => {
  Logger.log('Shoredark initiated.')
  client.initApplicationCommands()
  client.initApplicationPermissions()
})

client.login(process.env.CLIENT_TOKEN)
