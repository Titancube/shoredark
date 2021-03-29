import { Command, CommandMessage, Infos } from "@typeit/discord";

export abstract class Crash {
  @Command("아")
  @Infos({
    command: `아`,
    detail: "`$아`",
    description: "* 레이드니카 크래시",
  })
  private async crash(command: CommandMessage): Promise<void> {
    const vc = command.member.voice.channel;
    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play("../assets/audio/radenika.mp3");
      dispatcher.on("finish", () => {
        command.guild.me.voice.channel.leave();
        dispatcher.destroy();
      });
    } else {
      command.channel.send("보이스 채널에 입장해주세요");
    }
  }
}
