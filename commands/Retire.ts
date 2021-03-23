import { Command, CommandMessage, Infos } from "@typeit/discord";
import db from '../plugins/firebase'
import { format, formatDistanceToNowStrict } from 'date-fns'
import ko from 'date-fns/locale/ko'

export abstract class Hello {
    @Command("전역")
    @Infos({
        command: `전역`,
        detail: '`$전역`',
        description: '* 복무중인 인원에 대한 전역일과 남은 시간을 확인할 수 있습니다.'
    })
    async retire(command: CommandMessage): Promise<void> {
        command.channel.send(await this.getRetireDay())
    }

    // thanks to 7OAST
    showDischargeDate(date: number | Date): string {
        if (date < new Date) { return '전역' }

        const distance = parseInt(formatDistanceToNowStrict(date, { addSuffix: false, unit: 'second' }))

        if (distance < 86400) {

            const resultTime = Math.floor(distance / 3600);
            const remainder = Math.floor(distance % 3600 / 60)



            if (distance < 3600) {
                const remainder = Math.floor(distance / 60);
                return `${remainder}분`
            } else {
                return `${resultTime}시간 ${remainder}분`
            }
        } else {
            return formatDistanceToNowStrict(date, { unit: 'day', locale: ko })
        }
    }

    async getRetireDay(): Promise<string> {
        const r = await db.collection('Retire').get()
        const agents: { name: string, dischargeDate: Date, variant: string }[] = []
        let str = '복무중인 인원이 없습니다'
        if (r) {
            r.forEach((doc) => {
                agents.push({
                    name: doc.data().name,
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
                        `+ ${v.variant} | 전역일: ${format(v.dischargeDate, 'yyyy년 MM월 dd일')} | 잔여일수: ${this.showDischargeDate(v.dischargeDate)}`
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
