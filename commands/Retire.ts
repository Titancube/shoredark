import { Command, CommandMessage } from "@typeit/discord";
import db from '../plugins/firebase'
import { format, formatDistanceToNowStrict } from 'date-fns'
import ko from 'date-fns/locale/ko'

export abstract class Hello {
    @Command("전역")
    async retire(command: CommandMessage): Promise<void> {
        command.channel.send(await this.getRetireDay())
    }

    async getRetireDay(): Promise<string> {
        const r = await db.collection('Retire').get()
        const agents: { name: string, dischargeDate: Date, variant: string, status: boolean }[] = []
        let str = '복무중인 인원이 없습니다'
        if (r) {
            r.forEach((doc) => {
                agents.push({
                    name: doc.id,
                    dischargeDate: doc.data().dischargeDate.toDate(),
                    variant: doc.data().variant,
                    status: doc.data().status
                })
            })
            if (agents) {
                str = ''
                agents.forEach((v) => {
                    str = str + '\n' + `\`\`\`` + '\n' + `${v.name}` + '\n' + `'${v.variant} - ${v.status === true ? '현역' : '전역'}' | 전역일: ${format(v.dischargeDate, 'yyyy년 MM월 dd일')} | 잔여일수: ${formatDistanceToNowStrict(v.dischargeDate, { unit: 'day', locale: ko })}\`\`\``
                })
                return str
            } else {
                str = `SERVER ERROR`
                return str
            }

        } else {
            return str
        }
    }
}
