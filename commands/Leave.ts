import { Command, CommandMessage, Infos } from "@typeit/discord";

export abstract class Leave {
  @Command("나가")
  @Infos({
    command: `나가`,
    detail: "`$나가`",
    description: "* 보이스 채널에서 나갑니다",
  })
  private async leave(command: CommandMessage): Promise<void> {
    const vc = command.member.voice.channel;
    if (vc) {
      vc.leave();
    } else {
      return;
    }
  }
}
