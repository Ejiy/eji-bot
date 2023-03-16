import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";
import { Slash, SlashGroup, SlashOption, Discord, Guard } from "discordx";
import { Warn } from "../../database/index.js";
import { WarnRemoveEmbed } from "../../utils/index.js";

@Discord()
@Category('Moderation')
class WarnRemove {
  @Slash({ description: "Remove Warn" })
  @SlashGroup('warn')
  @Guard(PermissionGuard(['KickMembers']))
  async remove(
    @SlashOption({
      description: "User",
      name: 'user',
      required: true,
      type: ApplicationCommandOptionType.User
    })
    user: GuildMember,
    @SlashOption({
      description: "Warn ID",
      name: "id",
      required: true,
      type: ApplicationCommandOptionType.String
    })
    id: string,
    interaction: CommandInteraction
  ) {
    const filter = { guild: interaction.guildId, user: user.id, "warns.id": id }
    const update = { $pull: { warns: { id: id } } }
    const data = await Warn.findOneAndUpdate(filter, update)
    if (!data) {
      return interaction.reply(`Warn ID: ${id} doesn't exist`);
    } else {
      const embed = WarnRemoveEmbed(user.user, interaction.user, id)
      return interaction.reply({ embeds: [embed] })
    }
  }
}
