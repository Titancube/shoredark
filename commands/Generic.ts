import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, GuildMember } from 'discord.js'
import db from '../plugins/firebase'
import { Markov } from '../plugins/markov'
import * as dotenv from 'dotenv'
import { Logger, MessageComposer, Validate } from '../plugins/tools'
dotenv.config()

@Discord()
export abstract class Generic {
  @Slash('도네', { description: '방장에게 기부하기' })
  private donate(command: CommandInteraction) {
    command.reply({
      content:
        '방장에게 기부하기 ➡ https://paypal.me/titancube\n`or`\n' +
        process.env.BANK_ACCOUNT,
      ephemeral: true,
    })

    Logger.log(`Command: Donation log >> ${command.user.username}`)
  }

  // * SAY FUNCTION
  //  imitates target person
  //  Currently not working, will fix later
  //  ================================================================================
  // @Slash('말', {
  //   description: '멘션된 사람의 채팅 기록을 보고 새 메시지를 만들어 냅니다.',
  // })
  private async say(
    @SlashOption('유저', {
      description: '따라할 사람을 선택합니다.',
      type: 'USER',
    })
    user: GuildMember,
    @SlashOption('길이', {
      description:
        '만들어질 메시지의 길이를 선택합니다. 5 에서 100 까지의 수를 입력하세요.',
      type: 'INTEGER',
    })
    length: number,
    command: CommandInteraction
  ): Promise<void> {
    if (length < 5 || length > 100)
      command.reply('5부터 100 사이의 숫자를 입력하세요.')

    Logger.log(
      `Imitation log >> USER ${user.id} (${user.displayName}) | LENGTH ${length}`
    )

    const tempMessageHolder = []
    const getHistory = await db
      .collection('Member')
      .doc(user.id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(150)
      .get()

    if (!getHistory.empty) {
      getHistory.forEach((r) => {
        tempMessageHolder.push(r.data().message)
      })

      const messagesToLearn: string[] = Markov.wordsFilter(
        tempMessageHolder,
        length
      )

      if (messagesToLearn.length < 5) {
        return command.reply('메시지를 만들어내기 위한 채팅 기록이 부족합니다.')
      }

      const markov = new Markov()

      markov.addState(messagesToLearn)
      markov.train()
      return command.reply(
        `${Validate.filterSnowflake(user.displayName)}: ${markov.generate(
          length
        )}`
      )
    } else {
      return command.reply('존재하지 않는 유저입니다.')
    }
  }

  // * Show birthdays list
  // ! Unfinished !
  @Slash('생일', {
    description: '이번 달 및 다음 달 생일인 멤버를 확인합니다.',
  })
  private async birthday(command: CommandInteraction) {
    const birthdayList: { id: string; birthday: Date }[] = []
    const response = await db
      .collection('Member')
      .where('birthday', '!=', null || '')
      .orderBy('birthday', 'desc')
      .get()
    // Try to get birthdays
    try {
      // Push each data containing id and birthday into birthdayList if reponse is not empty
      if (!response.empty) {
        response.forEach((element) => {
          birthdayList.push({
            id: element.id,
            birthday: element.data().birthday,
          })
        })
      }
    } catch (error) {
      // Push error to log file
      Logger.log(error, true)
    } finally {
      // Return composed message
      return birthdayList.length > 0
        ? command.reply({
            content: MessageComposer.composeBirthdayMessage(birthdayList),
            ephemeral: true,
          })
        : command.reply('등록된 생일이 없습니다.')
    }
  }

  // * Add user's own birthday
  @Slash('생일등록', {
    description: '자신의 생일을 등록합니다.',
  })
  private addOwnBirthday(
    @SlashOption('yyyy')
    year: number,
    @SlashOption('mm')
    month: number,
    @SlashOption('dd')
    date: number,
    command: CommandInteraction
  ) {
    const userId = command.user.id
    const birthday = new Date(year, month, date)

    db.collection('Member')
      .doc(userId)
      .set({ birthday: birthday }, { merge: true })
  }
}
