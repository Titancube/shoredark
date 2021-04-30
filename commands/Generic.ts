import { Command, CommandMessage, Infos } from '@typeit/discord'
import db from '../plugins/firebase'
import { Markov } from '../plugins/markov'
import * as dotenv from 'dotenv'
import { Validate } from '../plugins/tools'
dotenv.config()

export abstract class Generic {
  @Command('도네')
  @Infos({
    command: `도네`,
    detail: '`$도네`',
    description: '* 방장에게 기부하기',
  })
  private donate(command: CommandMessage) {
    command.channel.send(
      '방장에게 기부하기 ➡ https://paypal.me/titancube\n`or`\n' +
        process.env.BANK_ACCOUNT
    )
  }

  // imitates target person
  @Command('말 :tempPerson :tempCount')
  @Infos({
    command: `말`,
    detail: `\`$말 <@멘션> <길이?>\``,
    description:
      '* 멘션된 사람의 채팅 기록에 기반해 새 메시지를 만들어 냅니다\n* 선택적으로 <길이> 옵션을 통해 메시지의 길이를 정할 수 있습니다\n',
  })
  private async say(command: CommandMessage): Promise<void> {
    const { tempPerson, tempCount } = command.args
    const person: string = Validate.validateUser(tempPerson)
      ? Validate.userStringParser(tempPerson)
      : Validate.userStringParser(command.author.id)
    const count: number = Validate.checkNumber(tempCount)
      ? parseInt(tempCount + '')
      : 5

    const tempMessageHolder = []
    const getHistory = await db
      .collection('Member')
      .doc(person)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(150)
      .get()

    if (!getHistory.empty) {
      getHistory.forEach((r) => {
        tempMessageHolder.push(r.data().message)
      })

      const messagesToLearn: Array<string> = Validate.wordsFilter(
        tempMessageHolder,
        count
      )

      if (messagesToLearn.length < 5) {
        command.channel.send('표본의 수가 너무 적습니다')
        return
      }

      const markov = new Markov()

      markov.addState(messagesToLearn)
      markov.train()
      command.channel.send(markov.generate(count))
    } else {
      command.channel.send('존재하지 않는 유저입니다')
    }
  }
}
