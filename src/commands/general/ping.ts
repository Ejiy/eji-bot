import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
@Category('General')
export class Ping {
  @Slash({ name: 'ping', description: "Ping" })
  async ping(
    interaction: CommandInteraction,
  ) {
    const start = Date.now()
    await interaction.reply({ content: "Pinging..." })
    const end = Date.now()
    const latency = end - start
    interaction.editReply({ content: `Latency: ${latency}ms` })
  }
}
