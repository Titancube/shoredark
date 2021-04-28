import { Command, CommandMessage, Infos } from '@typeit/discord'
import axios from 'axios'
import { randomInt } from 'crypto'
import * as dotenv from 'dotenv'
dotenv.config()

export abstract class RandomShitpost {
  @Command('랜덤이오티')
  @Infos({
    command: `랜덤이오티`,
    detail: '`$랜덤이오티`',
    description: '* EOTI 트랙을 랜덤하게 가져옵니다',
  })
  private async randomEoti(command: CommandMessage): Promise<void> {
    this.fetchTracks('Explorers%20of%20the%20Internet', 'KANKER!', command)
  }

  @Command('랜덤응과')
  @Infos({
    command: `랜덤응과`,
    detail: '`$랜덤응과`',
    description: '* 쉬티피디아 트랙을 랜덤하게 가져옵니다',
  })
  private async randomShittypedia(command: CommandMessage): Promise<void> {
    this.fetchTracks('Shittypedia', '정말 알고싶은 정보였어요!', command)
  }

  /**
   * Fetch tracks from API response
   * @param target search target
   * @param message which being sent on the channel
   * @param command `CommandMessage`
   */
  private async fetchTracks(
    target: string,
    message: string,
    command: CommandMessage
  ) {
    const api = `https://api.soundcloud.com/tracks?q=${target}&access=playable&limit=50&linked_partitioning=true&client_id=`
    const searchResults = await axios.get(api + process.env.SC_CLIENT_ID, {
      headers: { Authorization: 'Bearer' + process.env.SC_OAUTH_TOKEN },
    })
    const randomTrackNumber = randomInt(0, 50)

    command.channel.send(
      `${message} ${searchResults.data.collection[randomTrackNumber].permalink_url}`
    )
  }
}
