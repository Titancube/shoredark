import { Command, CommandMessage, Infos } from '@typeit/discord'
import axios from 'axios'

export abstract class Help {

    @Command("환율 :baseCurrency :targetCurrency")
    @Infos({
        command: `환율`,
        detail: '`$환율 <기축통화> <대상통화>`',
        description: `* 유럽 중앙 은행 기준 매 시간 업데이트되는 전세계 환율을 확인할 수 있습니다.
        * \`기축통화\` 를 별도로 설정하지 않을 시 대한민국 원(KRW)으로 자동 설정됩니다.
        * \`대상통화\` 를 설정하면  `,
    })
    private async help(command: CommandMessage): Promise<void> {

        const { baseCurrency, targetCurrency } = command.args
        const ucBaseCurrency: string = this.parseToString(baseCurrency).toUpperCase()
        const ucTargetCurrency: string = this.parseToString(targetCurrency).toUpperCase()
        const api = `https://api.exchangeratesapi.io/latest?${this.getBaseCurrency(ucBaseCurrency)}${this.getTargetCurrency(ucTargetCurrency)}`
        const r = await axios.get(api)

        if (r) {
            // let rates = ``
            const ratesArray = Object.keys(r.data.rates)
            ratesArray.forEach(v => {
                console.log(v)
            })
            const str = `
            **환율 정보** : ${r.data.date} | **기축통화** : ${r.data.base}
            
            
            `
            console.log('SUCCESS')
        } else {
            command.channel.send('환율 정보가 없습니다.')
            console.log('ERROR: NO DATA')
        }
    }

    private getBaseCurrency(currency: string): string {
        if (currency) {
            return `&base=${currency}`
        } else {
            return '&base=KRW'
        }
    }

    private getTargetCurrency(currency: string): string {
        if (currency) {
            return `&symbols=${currency}`
        } else {
            return ``
        }
    }

    private parseToString(s): string {
        return s + ''
    }
}