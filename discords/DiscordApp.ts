import { CommandNotFound, Discord, CommandMessage, On, ArgsOf, Client } from "@typeit/discord";
import * as Path from "path";

@Discord("$", {
  import: [
    Path.join(__dirname, "..", "commands", "*.ts")
  ]
})
export class DiscordApp {
  @On("message")
  onMessage(
    [message]: ArgsOf<"message">,
    client: Client
  ): void {
    console.log(message);
  }

  @CommandNotFound()
  notFoundA(command: CommandMessage): void {
    command.channel.send("그런 거 없음");
  }
}
