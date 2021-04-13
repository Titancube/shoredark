import { Command, CommandMessage, Infos } from "@typeit/discord";

export abstract class Birthday {
  @Command("생일")
  @Infos({
    command: `생일`,
    detail: "`$생일`",
    description: "* 이번 달 생일인 멤버를 확인합니다.",
  })
  private async birthday(command: CommandMessage): Promise<void> {
    try {
      command.channel.send("준비중입니다.");
    } catch (error) {
      command.channel.send(error);
    } finally {
      command.channel.send("===DONE===");
    }
  }
}
