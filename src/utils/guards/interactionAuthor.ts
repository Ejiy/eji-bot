import { ChannelSelectMenuInteraction, CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { GuardFunction } from "discordx";

export const IsAuthor: GuardFunction<ChannelSelectMenuInteraction | StringSelectMenuInteraction> = async (interaction, client, next) => {
  if (interaction.user.id !== interaction.message.interaction?.user.id) {
    if (interaction.deferred) {
      return interaction.followUp("You can't do that!")
    } else {
      return interaction.reply({ content: "You can't do that!", ephemeral: true }).then(x => {
        setTimeout(() => {
          try {
            x.delete()
          } catch (e) {
            throw e
          }
        }, 2000);
      })
    }
  }
  next()
}
