import { Command, CommandMessage, Guard, On } from '@typeit/discord'
import { isAdmin } from '../guards/isAdmin'
import { roles } from '../json/roles.json'
import fs from 'fs'

export abstract class Role {
  @Command('역할')
  @Guard(isAdmin)
  private async reactionMessage(command: CommandMessage) {
    const sendMessage = await command.channel.send(
      'Shorelight에서는 역할에 따라 볼 수 있는 채널 카테고리를 다르게 하고 있습니다.\n아래 대응하는 리액션을 눌러 원하는 채널에 입장해보세요. 역할을 제거하려면 다시 누르시면 됩니다.'
    )
    fs.open('dist/id.txt', 'w', (e, fileId) => {
      fs.write(fileId, sendMessage.id, (e) => {
        if (e) {
          console.error(`[${new Date()}] ${e}`)
        }
      })
      fs.close(fileId, (e) => {
        if (e) {
          console.error(`[${new Date()}] ${e}`)
        }
      })
    })

    command.channel.send(this.roleListParser(roles))
  }

  @On('messageReactionAdd')
  private roleAdd() {
    // assign a role to the user
  }

  @On('messageReactionRemove')
  private roleRemove() {
    // remove a role from the user
  }

  /**
   * Validate if the message is role holder
   * @param id message id
   * @returns `boolean`
   */
  private validateRoleListener(id: string): boolean {
    let storedId = ''
    fs.readFile('dist/id.txt', 'utf-8', (e, data) => {
      if (e) {
        console.error(`[${new Date()}] ${e}`)
        storedId = data
      }
    })

    return id === storedId ? true : false
  }

  /**
   * Retrieves roles from JSON and returns parsed list
   * @param data json
   * @returns parsed list of roles
   */
  private roleListParser(
    data: { name: string; description: string; emoji: string; role: string }[]
  ): string {
    const enclosure = '```'
    let str = ''
    data.forEach((el) => {
      str += `${el.emoji} ${el.name} : ${el.description}\n`
    })

    return `${enclosure}\n${str}\n${enclosure}`
  }
}
