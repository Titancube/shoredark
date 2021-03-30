import { Command, CommandMessage, Infos } from "@typeit/discord";
import * as path from "path";

export abstract class Crash {
  @Command("재상 :variation")
  @Infos({
    command: `재상`,
    detail: "`$재상 <variation>`",
    description:
      "* 우리의 영웅 박재상씨가 현명한 단어를 내뱉습니다\n* <variation> : `옵, 여자, 어, 에, 야한여자, 정숙`\n* <variation> 미설정시 `옵`이 기본 재생됩니다",
  })
  private async crash(command: CommandMessage): Promise<void> {
    const { variation } = command.args;

    const vc = command.member.voice.channel;
    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play(
        path.join(__dirname, `../assets/audio/${this.getVariation(variation)}`)
      );

      dispatcher.setVolume(0.25);

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

  private getVariation(v: string): string {
    switch (v) {
      default:
      case "옵":
        return "op.mp3";
      case "여자":
        return "girl.mp3";
      case "어":
        return "uh.mp3";
      case "에":
        return "ee.mp3";
      case "야한여자":
        return "hentai_girl.mp3";
      case "정숙":
        return "silence.mp3";
    }
  }
}
