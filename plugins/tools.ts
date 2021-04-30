import { CommandMessage } from '@typeit/discord'
import path from 'path'

export class Validate {
  /**
   * Trims discord mention's head & tail i.e `<!@...>`
   * @param user discord mention
   * @returns parsed by regex
   */
  static userStringParser(user: string): string {
    const validate = new RegExp(/([0-9])+/g)
    return validate.exec(user)[0]
  }

  /**
   * Check if `user` is valid id
   * @param user
   * @returns `boolean`
   */
  static validateUser(user: string): boolean {
    const validate = new RegExp(/([0-9])+/g)
    return user && validate.exec(user)[0] ? true : false
  }

  /**
   * Filters valid sentences to train markov chain
   * @param arr unfiltered message history
   * @param count minimum length of the array of message history split by whitespace
   * @returns array of filtered
   */
  static wordsFilter(arr: Array<string>, count: number): Array<string> {
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
  static checkNumber(num: unknown): boolean {
    try {
      return typeof num == 'number' ? true : false
    } catch (e) {
      console.error(`[${new Date()}] ${e}`)
    }
  }
}

export class Voice {
  /**
   * Audio file fetcher for Voice channels
   * @param command `CommandMessage`
   * @param file filename
   * @param volume volume
   */
  static async voiceEmitter(
    command: CommandMessage,
    file: string,
    volume: number
  ): Promise<void> {
    const vc = command.member.voice.channel
    if (vc) {
      const r = await vc.join()
      const dispatcher = r.play(path.join(__dirname, `../assets/audio/${file}`))

      dispatcher.setVolume(volume)

      dispatcher
        .on('finish', () => {
          dispatcher.destroy()
          command.member.voice.channel.leave()
        })
        .on('error', (e) => {
          console.log(`
          ${e.name}

          ${e.message}

          ${e.stack}
          `)
        })
    } else {
      command.channel.send('보이스 채널에 입장해주세요')
    }
  }
}
