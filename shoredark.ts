import 'reflect-metadata'
import { format } from 'date-fns'
import { Intents } from 'discord.js'
import { Client } from 'discordx'
import * as dotenv from 'dotenv'
import { Logger } from './plugins/tools'
import { dirname, importx } from '@discordx/importer'
dotenv.config({ path: __dirname + '/.env' })

async function start() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_BANS,
    ],
    botGuilds: [process.env.GUILD_ID!],
    silent: false,
  })

  try {
    client.on('ready', async () => {
      console.clear()
      Logger.writeLog(`\r\n${'-'.repeat(10)} Shoredark ${'-'.repeat(10)}`, true)
      Logger.writeLog(
        `Booted at ${format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS')}\r\n`,
        true
      )
      Logger.log('Initializing current slash commands...')
      // await client.clearApplicationCommands(process.env.GUILD_ID)
      await client.initApplicationCommands()
      await client.initApplicationPermissions()
      Logger.log('...DONE')
      Logger.log('Shoredark is Ready')
    })

    client.on('interactionCreate', (interaction) => {
      client.executeInteraction(interaction)
    })

    await importx(`${__dirname}/commands/**/*.{ts,js}`)

    client.login(process.env.CLIENT_TOKEN)
  } catch (e) {
    Logger.log('Exception', true)
    console.error(e)
  }
}

start()
