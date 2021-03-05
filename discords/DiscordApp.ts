import { CommandNotFound, Discord, CommandMessage } from "@typeit/discord";
import * as Path from "path";

@Discord("$", {
  import: [
    Path.join(__dirname, "..", "commands", "*.ts")
  ]
})
export class DiscordApp {
  @CommandNotFound()
  notFoundA(command: CommandMessage): void {
    command.channel.send("ㄹㅇㅋㅋ");
  }
}
