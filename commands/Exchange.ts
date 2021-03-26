import { Command, CommandMessage, Infos } from '@typeit/discord'
import axios from 'axios'

export abstract class exchange {

    @Command("환율 :_amount :baseCurrency :targetCurrency")
    @Infos({
        command: `환율`,
        detail: '`$환율 <금액> <기축통화> <대상통화>`',
        description: `* 유럽 중앙 은행 기준 매 시간 업데이트되는 전세계 환율을 확인할 수 있습니다.
* \`금액\` 을 별도로 설정하지 않을 시 1,000원을 기준으로 표시합니다.
* \`기축통화\` 를 별도로 설정하지 않을 시 대한민국 원(KRW)으로 자동 설정됩니다.
* \`대상통화\` 를 설정하면 해당 대상 통화를 가져옵니다.`,
    })
    private async exchange(command: CommandMessage): Promise<void> {

        const { _amount, baseCurrency, targetCurrency } = command.args
        const amount = parseInt(_amount)
        const ucBaseCurrency: string = this.parseToString(baseCurrency).toUpperCase()
        const ucTargetCurrency: string = this.parseToString(targetCurrency).toUpperCase()
        const api = `https://api.exchangeratesapi.io/latest?${this.getBaseCurrency(ucBaseCurrency)}${this.getTargetCurrency(ucTargetCurrency)}`
        const r = await axios.get(api)

        console.log(amount, baseCurrency, targetCurrency)

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