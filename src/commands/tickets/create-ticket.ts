import { Category } from "@discordx/utilities";
import { randomUUID } from "crypto";
import { ActionRowBuilder, ActionRowComponent, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, CommandInteraction, EmbedBuilder, GuildChannelType, MessageActionRowComponentBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { TicketChannel, TicketConfig } from "../../database/index.js";

@Discord()
@SlashGroup({ name: 'ticket', description: "Ticket" })
@Category('Ticket')
export class TicketCreate {
  @Slash({ description: "Create Ticket" })
  @SlashGroup('ticket')
  async create(interaction: CommandInteraction) {
    const data = await TicketConfig.findOne({ guild: interaction.guildId })
    if (!data?.category || interaction.guild?.channels.cache.get(data?.category)?.type !== ChannelType.GuildCategory) {
      return interaction.reply("We can't find the category channel... does this have been setup?")
    }

    const category = await interaction.guild.channels.fetch(data?.category) as CategoryChannel
    if (!category) {
      return interaction.reply("We can't find the channel category...")
    }

    const tdata = await TicketChannel.findOne({ guild: interaction.guildId, user: interaction.user.id })

    if (tdata?.channel) {
      if (interaction.guild.channels.cache.get(tdata?.channel)) {
        return interaction.reply(`You already have one ticket opened at <#${tdata?.channel}>`)
      } else {
        await TicketChannel.findOneAndDelete({ guild: interaction.guildId, user: interaction.user.id })
      }
    }
    const channel = await interaction.guild.channels.create({
      type: ChannelType.GuildText,
      name: `ticket-${interaction.user.username}`,
      parent: category.id,
      position: category.children.cache.size + 1
    })

    await new TicketChannel({
      guild: interaction.guildId,
      channel: channel.id,
      user: interaction.user?.id,
      id: randomUUID(),
      opened: Date.now(),
      status: "open",
    }).save()

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s ticket`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setDescription("If you're here for free resource support (jl-laptop) please close this imidiately")
      .setColor("Red")

    const button1 = new ButtonBuilder()
      .setLabel("Close ticket")
      .setStyle(ButtonStyle.Danger)
      .setCustomId('ticket-close')

    const buttonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button1)

    await channel.send({
      embeds: [embed],
      components: [buttonRow]
    })

    interaction.reply({ ephemeral: true, content: `We've created your ticket in <#${channel.id}>` })

  }
}
