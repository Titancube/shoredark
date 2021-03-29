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
* \`대상통화\` 를 설정하면 해당 대상 통화를 가져옵니다.
* 환율이 1보다 높을 시 녹색, 미만일 경우 적색으로 표시됩니다.`,
    })
    private async exchange(command: CommandMessage): Promise<void> {

        const { _amount, baseCurrency, targetCurrency } = command.args
        const amount: number = _amount != undefined ? parseFloat(_amount) : 1000
        const ucBaseCurrency: string = this.parseToString(baseCurrency).toUpperCase()
        const ucTargetCurrency: string = this.parseToString(targetCurrency).toUpperCase()

        const api = `https://api.exchangeratesapi.io/latest?${this.getBaseCurrency(ucBaseCurrency)}${this.getTargetCurrency(ucTargetCurrency, ucBaseCurrency)}`
        const r = await axios.get(api)

        try {
            const data = r.data
            if (data) {
                const str = `**환율 정보**\n\n기준 : \`${data.date}\`\n기축통화 : \`${data.base}\`\n금액 : \`${amount.toLocaleString('ko-KR')}\`\n\n`
                let rates = '대상 통화\n\n'
                for (const [key, value] of Object.entries(data.rates)) {
                    rates += `${typeof value === 'number' ? this.checkMargin(value) : ''} ${this.currencyType(key)} : ${typeof value === 'number' ? (value * amount).toFixed(2) : ''}\n`
                }

                command.channel.send(str + '```diff\n' + rates + '```')
            } else {
                command.channel.send('환율 정보가 없습니다.')
            }
        } catch (e) {
            console.error(e)
        }
    }

    private getBaseCurrency(currency: string): string {
        if (currency) {
            return `&base=${currency}`
        } else {
            return '&base=KRW'
        }
    }

    private getTargetCurrency(currency: string, x: string): string {
        const currencies = ['USD', 'JPY', 'EUR', 'KRW', 'GBP']
        x ? x : x = 'KRW'
        if (currency) {
            return `&symbols=${currency}`
        } else {
            return `&symbols=${currencies.filter(v => v.toUpperCase() !== x).join(',')}`
        }
    }

    private parseToString(s): string {
        if (s !== null && s !== undefined) {
            return s + ''
        } else {
            return ''
        }
    }

    private currencyType(c: string): string {
        switch (c) {
            case 'USD':
                return '미국 달러 (USD $)'
            case 'EUR':
                return '유럽 유로 (EUR €)'
            case 'JPY':
                return '일본 엔화 (JPY ￥)'
            case 'KRW':
                return '한국 원화 (KRW ￦)'
            case 'GBP':
                return '영국 파운드 (GBP ￡)'
            default:
                return c
        }
    }

    private checkMargin(n: number) {
        if (n > 1) {
            return '+'
        } else if (n < 1) {
            return '-'
        } else {
            return '='
        }
    }
}