import { ApplicationCommandOptionType, CommandInteraction, GuildMember, PermissionResolvable } from "discord.js";
import { Discord, Guard, MetadataStorage, Slash, SlashOption } from "discordx";
import { PermissionGuard, Category } from '@discordx/utilities'

@Discord()
@Category('Moderation')
export class Ban {
  @Slash({ description: "Ban that nasty user", name: "ban" })
  @Guard(PermissionGuard(['BanMembers']))
  async ban(
    @SlashOption({
      name: 'user',
      description: "User to ban",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    interaction: CommandInteraction,
  ) {
    if (user.id === interaction.user.id) {
      return interaction.reply("You can't ban yourself")
    }
  }
}
