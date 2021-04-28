import { ArgsOf, Guard, On } from '@typeit/discord'
import { NotBot } from '../guards/NotBot'
import db from '../plugins/firebase'

export abstract class Remember {
  @On('message')
  @Guard(NotBot)
  async remember([msg]: ArgsOf<'message'>): Promise<void> {
    // Cancel saving if the message is a command, empty or is in admin channel
    if (
      msg.content.startsWith('$') ||
      msg.channel.id === '549945738457645078' ||
      msg.content === '' ||
      msg.content.startsWith('http')
    ) {
      return
    }

    // Save in DB
    try {
      await db
        .collection('Member')
        .doc(msg.author.id)
        .collection('Messages')
        .doc(msg.id)
        .set({
          message: msg.content, // Actual message
          createdAt: msg.createdAt, // When did the message created
        })
    } catch (e) {
      console.log(e)
    }
  }
}
