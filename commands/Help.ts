import { Client, Command, CommandMessage, Description, Infos } from '@typeit/discord'

export abstract class Help {

    @Command("도움 :mTarget")
    @Infos({
        command: `도움`,
        detail: '`$도움 <명령어>`',
        description: ''
    })
    @Description(`* Get general info about all commands`)
    private async help(command: CommandMessage): Promise<void> {
        const { mTarget } = command.args
        const details = Client.getCommands();
        const title = '**명령어 목록**\n\n`$도움 <명령어>` 를 입력해 특정 명령어에 대한 도움말을 확인할 수 있습니다.'
        let str = ''
        const opener = '```\n'
        const closer = '\n```'
        if (!mTarget) {
            details.forEach(v => {
                str = str + v.infos.command + '\n'
                str = `${str} + * ${v.infos.command} - ${v.infos.detail}`
            })
            command.channel.send(title + opener + str + closer)
        } else {
            const result = details.filter(v => v.infos.command === mTarget.toString())
            if (result.length > 0) {
                const title = result[0].infos.detail
                const content = result[0].infos.description
                str = `${title}\n\n${content}`
                command.channel.send(str)
            } else {
                command.channel.send('해당 명령어가 존재하지 않습니다.')
            }
        }

    }
}