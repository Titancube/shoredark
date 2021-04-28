import { Command, CommandMessage, Infos } from '@typeit/discord'
import db from '../plugins/firebase'
import { Markov } from '../plugins/markov'
import * as dotenv from 'dotenv'
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
    const person: string = this.validateUser(tempPerson)
      ? this.userStringParser(tempPerson)
      : this.userStringParser(command.author.id)
    const count: number = this.checkNumber(tempCount)
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

      const messagesToLearn: Array<string> = this.wordsFilter(
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

  /**
   * Trims discord mention's head & tail i.e `<!@...>`
   * @param user discord mention
   * @returns parsed by regex
   */
  private userStringParser(user: string) {
    const validate = new RegExp(/([0-9])+/g)
    return validate.exec(user)[0]
  }

  /**
   * Check if `user` is valid id
   * @param user
   * @returns `boolean`
   */
  private validateUser(user: string): boolean {
    const validate = new RegExp(/([0-9])+/g)
    return user && validate.exec(user)[0] ? true : false
  }

  /**
   * Filters valid sentences to train markov chain
   * @param arr unfiltered message history
   * @param count minimum length of the array of message history split by whitespace
   * @returns array of filtered
   */
  private wordsFilter(arr: Array<string>, count: number) {
    for (let i = count; i > 0; i--) {
      const newArr: Array<string> = arr.filter((s) => s.split(' ').length >= i)
      if (newArr.length >= 5) return newArr
    }
  }

  /**
   * Check if the property can be parsed into number and returns it
   * @param num unknown
   * @returns Parsed number if the `num` could be parsed
   */
  private checkNumber(num: unknown): boolean {
    try {
      return typeof num == 'number' ? true : false
    } catch (e) {
      console.error(`[${new Date()}] ${e}`)
    }
  }
}
