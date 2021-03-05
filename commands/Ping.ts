import { Command, CommandMessage, Guard } from "@typeit/discord";
import { Say } from "../guards/Say";

export default abstract class Ping {
  @Command()
  @Guard(Say("Pong"))
  async execute(command: CommandMessage) {
    command.reply("Pong");
  }
}

