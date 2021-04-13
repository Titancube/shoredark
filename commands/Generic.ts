import { Command, CommandMessage, Infos } from "@typeit/discord";

export abstract class Generic {
  @Command("도네")
  @Infos({
    command: `도네`,
    detail: "`$도네`",
    description: "* 방장에게 기부하기",
  })
  private donate(command: CommandMessage) {
    command.channel.send("방장에게 기부하기 ➡ https://paypal.me/titancube");
  }
}
