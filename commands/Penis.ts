import { CommandInteraction } from 'discord.js'
import { Discord, Slash } from 'discordx'
import db from '../plugins/firebase'

@Discord()
export abstract class Penis {
  @Slash('ㅈ', { description: '신이 주사위를 굴립니다.' })
  private async penis(command: CommandInteraction): Promise<void> {
    const testicles = '3'
    const glans = 'D'
    const stick = '='

    const snapshot = db.collection('Member').doc(command.user.id)
    const r = await snapshot.get()

    const fate = (): number => {
      return Math.floor(Math.random() * 100)
    }

    const penisConstructor = (n: number): number => {
      if (n < 80 || n + 1 > 500 || n + penisConstructor(fate()) > 500) {
        command.channel.send(`신이 주사위를 굴렸습니다!`)
        return n
      }
      command.channel.send(`한번 더!`)
      return n + penisConstructor(fate())
    }

    const godHasSpoken = async () => {
      const penis =
        testicles + stick.repeat(penisConstructor(fate()) / 10) + glans
      await snapshot.set({ penis: penis }, { merge: true })
      command.channel.send(penis)
    }

    if (r.exists) {
      if (r.data().penis !== undefined) {
        command.channel.send(r.data().penis)
      } else {
        godHasSpoken()
      }
    } else {
      godHasSpoken()
    }
  }
}
