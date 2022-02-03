import { CommandInteraction } from 'discord.js'
import { Client, Discord, Slash } from 'discordx'

Discord()
export abstract class Help {
  @Slash('도움', {
    description:
      '특정 명령어에 대한 도움말을 확인할 수 있습니다. (명령어 재작업 중입니다.)',
  })
  private async help(command: CommandInteraction): Promise<void> {
    // const { mTarget } = command.args
    // const details = Client.getCommands()
    // const title =
    //   '**명령어 목록**\n\n`$도움 <명령어>` 를 입력해 특정 명령어에 대한 도움말을 확인할 수 있습니다.\n\n'
    // let str = ''
    // if (!mTarget) {
    //   details.forEach((v) => {
    //     str = `${str} * ${v.infos.command} - ${v.infos.detail}\n`
    //   })
    //   command.channel.send(title + str)
    // } else {
    //   const result = details.filter(
    //     (v) => v.infos.command === mTarget.toString()
    //   )
    //   if (result.length > 0) {
    //     const title = result[0].infos.detail
    //     const content = result[0].infos.description
    //     str = `${title}\n\n${content}`
    //     command.channel.send(str)
    //   } else {
    //     command.channel.send('해당 명령어가 존재하지 않습니다.')
    //   }
    // }
  }
}
