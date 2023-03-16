import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Warn } from "../../database/index.js";
import { WarnListEmbed } from "../../utils/index.js";


@Discord()
@Category('Moderation')
class WarnList {
  @Slash({ description: "Warn List (Mod only)" })
  @SlashGroup('warn')
  @Guard(PermissionGuard(['KickMembers']))
  async list(
    @SlashOption({
      description: "user",
      name: 'user',
      required: false,
      type: ApplicationCommandOptionType.User
    })
    user: GuildMember,
    interaction: CommandInteraction
  ) {
    const guildId = interaction.guildId
    const userID = user?.user.id ?? interaction.user.id
    const data = await Warn.findOne({ guild: guildId, user: userID })
    if (!data || data?.warns.length === 0) {
      return interaction.reply("This user doesn't have any warns")
    } else {
      const embed = WarnListEmbed(interaction.guild?.members.cache.get(userID)?.user ?? interaction.user, data?.warns)
      return interaction.reply({ embeds: [embed] })
    }
  }
}
