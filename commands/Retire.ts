import { Command, CommandMessage } from "@typeit/discord";
import db from '../plugins/firebase'
import { format, formatDistanceToNowStrict } from 'date-fns'
import ko from 'date-fns/locale/ko'

export abstract class Hello {
    @Command("전역")
    async retire(command: CommandMessage): Promise<void> {
        command.channel.send(await this.getRetireDay())
    }

    // thanks to 7OAST
    showDischargeDate(date: number | Date): string {
        const dateInt = parseInt(date.toString())

        if (dateInt < 86400) {
            if (dateInt < 3600) {
                const resultTime = Math.floor(dateInt / 24);
                const remainder = dateInt % 24;

                return `${resultTime}시간 ${remainder}분`
            }
        } else {
            return format(date, 'yyyy년 MM월 dd일')
        }
    }

    async getRetireDay(): Promise<string> {
        const r = await db.collection('Retire').get()
        const agents: { name: string, dischargeDate: Date, variant: string }[] = []
        let str = '복무중인 인원이 없습니다'
        if (r) {
            r.forEach((doc) => {
                agents.push({
                    name: doc.id,
                    dischargeDate: doc.data().dischargeDate.toDate(),
                    variant: doc.data().variant
                })
            })
            if (agents) {
                str = ''
                agents.forEach((v) => {
                    str +=
                        '\n\n' +
                        `${v.name}` +
                        '\n' +
                        `+ ${v.variant} | 전역일: ${this.showDischargeDate(v.dischargeDate)} | 잔여일수: ${formatDistanceToNowStrict(v.dischargeDate, { unit: 'day', locale: ko })}`
                })
                return '```diff\n- 전역일 일람표' + str + '\n```'
            } else {
                str = `SERVER ERROR`
                return str
            }

        } else {
            return str
        }
    }
}
