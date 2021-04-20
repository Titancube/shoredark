import { Command, CommandMessage, Infos } from "@typeit/discord";
import path from "path";

interface Variation {
  key: string;
  value: string;
}

export abstract class Voice {
  private static async voiceEmitter(
    command: CommandMessage,
    file: string,
    volume: number
  ) {
    const vc = command.member.voice.channel;
    if (vc) {
      const r = await vc.join();
      const dispatcher = r.play(
        path.join(__dirname, `../assets/audio/${file}`)
      );

      dispatcher.setVolume(volume);

      dispatcher
        .on("finish", () => {
          dispatcher.destroy();
          command.member.voice.channel.leave();
        })
        .on("error", (e) => {
          console.log(`
          ${e.name}

          ${e.message}

          ${e.stack}
          `);
        });
    } else {
      command.channel.send("보이스 채널에 입장해주세요");
    }
  }

  private static psyVariation: Variation[] = [
    { key: "옵", value: "op.mp3" },
    { key: "여자", value: "girl.mp3" },
    { key: "어", value: "uh.mp3" },
    { key: "에", value: "ee.mp3" },
    { key: "야한여자", value: "hentai_girl.mp3" },
    { key: "정숙", value: "silence.mp3" },
  ];

  private static getAllPsyVariation(): string {
    const arr = [];
    Voice.psyVariation.forEach((v) => {
      arr.push(v.key);
    });
    return arr.join(", ");
  }

  private static getPsyVoice(commandArgument: string): string {
    const filteredVoice = Voice.psyVariation.filter(
      (variation) => variation.key === commandArgument
    );

    if (commandArgument && commandArgument == "아무말") {
      return Voice.psyVariation[Math.floor(Math.random() * 6)].value;
    } else if (
      commandArgument &&
      filteredVoice &&
      filteredVoice.length > 0 &&
      Voice.psyVariation.includes(filteredVoice[0])
    ) {
      return filteredVoice[0].value;
    } else {
      return "op.mp3";
    }
  }

  @Command("아")
  @Infos({
    command: `아`,
    detail: "`$아`",
    description: "* 레이드니카 크래시",
  })
  private async crash(command: CommandMessage): Promise<void> {
    Voice.voiceEmitter(command, "radenika.wav", 0.25);
  }

  @Command("재상 :variation")
  @Infos({
    command: `재상`,
    detail: "`$재상 <단어>`",
    description: `* 우리의 영웅 박재상씨가 현명한 단어를 내뱉습니다\n* \`<단어>\` : \`${Voice.getAllPsyVariation()}\`\n* \`<단어>\` 미설정, 또는 임의 커맨드 입력 시 \`옵\`이 기본 재생됩니다`,
  })
  private async psy(command: CommandMessage): Promise<void> {
    const { variation } = command.args;

    Voice.voiceEmitter(command, Voice.getPsyVoice(variation), 0.25);
  }

  @Command("나가")
  @Infos({
    command: `나가`,
    detail: "`$나가`",
    description: "* 보이스 채널에서 나갑니다",
  })
  private async leave(command: CommandMessage): Promise<void> {
    const vc = () => (command.member.voice.channel ? true : false);
    if (vc) {
      command.member.voice.channel.leave();
    } else {
      return;
    }
  }
}
