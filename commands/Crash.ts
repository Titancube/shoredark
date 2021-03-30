import { Command, CommandMessage, Infos } from "@typeit/discord";
import * as path from "path";

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
      const dispatcher = r.play(
        path.join(__dirname, "../assets/audio/radenika.wav")
      );

      dispatcher.setVolume(0.75);

      dispatcher
        .on("finish", () => {
          dispatcher.destroy();
          command.guild.me.voice.channel.leave();
        })
        .on("error", (e) => {
          console.log(e);
        });
    } else {
      command.channel.send("보이스 채널에 입장해주세요");
    }
  }
}
