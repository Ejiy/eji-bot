import { PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember, User } from "discord.js";
import { Discord, SlashGroup, Slash, SlashOption, Guard } from "discordx";
import { Warn } from "../../database/index.js";
import { GenerateID, WarnEmbed } from "../../utils/index.js";

@Discord()
// Create a group
@SlashGroup({ description: "Warn User", name: "warn" })
class WarnAdd {
  @Slash({ description: "Warn User" })
  // Assign slash to the group
  @SlashGroup("warn")
  @Guard(PermissionGuard(['KickMembers']))
  // NOTE: WARN USER
  async user(
    @SlashOption({
      description: "User",
      name: 'user',
      required: true,
      type: ApplicationCommandOptionType.User
    })
    user: GuildMember,
    @SlashOption({
      description: "Reason",
      name: 'reason',
      required: true,
      type: ApplicationCommandOptionType.String
    })
    reason: string,
    interaction: CommandInteraction
  ) {
    const guildId = interaction.guildId
    const data = await Warn.findOneAndUpdate({
      guild: guildId,
      user: user.id
    }, {
      $push: {
        warns: {
          id: GenerateID(),
          moderator: interaction.user.id,
          reason: reason ?? "No reason",
          time: Date.now()
        }
      }
    })
    if (!data) {
      new Warn({
        user: user.id,
        guild: guildId,
        warns: [
          {
            id: GenerateID(),
            moderator: interaction.user.id,
            reason: reason ?? "No Reason",
            time: Date.now(),
          }
        ]
      }).save()
    }
    const embed = WarnEmbed(user, interaction.user, reason)
    interaction.reply({ embeds: [embed] })
  }
}
