import { Category } from "@discordx/utilities";
import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ChannelType, CommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Client, Discord, Guard, MetadataStorage, SelectMenuComponent, Slash, SlashGroup } from "discordx";
import { TicketConfig } from "../../database/index.js";
import { IsAuthor } from "../../utils/guards/interactionAuthor.js";
import { TicketLogEmbed } from "../../utils/index.js";


const config = [
  { label: "Set Channel", value: "set-channel" },
  { label: "Set Category", value: "set-category" },
  { label: "Set Log", value: "set-log" }
]


@Discord()
@Category('Ticket')
export class TicketConfigCommand {
  @Slash({ description: "Configuration for ticket" })
  @SlashGroup('ticket')
  private async config(interaction: CommandInteraction, client: Client) {
    const guildID = interaction.guildId

    const { embed, buttonRow } = await new TicketLogEmbed(guildID!, client).InitEmbed("init")

    interaction.reply({ embeds: [embed], components: [buttonRow] })
  }
  @SelectMenuComponent({ id: 'ticket-config' })
  @Guard(IsAuthor)
  private async handle(interaction: StringSelectMenuInteraction, client: Client): Promise<unknown> {
    await interaction.deferReply();
    if (interaction.message.interaction?.user.id !== interaction.user.id) {
      return interaction.followUp({ content: "You can't do that!" })
    }
    let embed = null
    let buttonRow = null
    const selected = config.find(r => r.value === interaction.values?.[0])
    switch (selected?.value) {
      case "set-log":
        ({ embed, buttonRow } = await new TicketLogEmbed(interaction?.guildId!, client).InitEmbed('log'))
        await interaction.message.edit({ embeds: [embed], components: [buttonRow] })
        interaction.deleteReply()
        break
      case "set-channel":
        ({ embed, buttonRow } = await new TicketLogEmbed(interaction.guildId!, client).InitEmbed('channel'));
        await interaction.message.edit({ embeds: [embed], components: [buttonRow] });
        interaction.deleteReply()
        break
      case "set-category":
        ({ embed, buttonRow } = await new TicketLogEmbed(interaction.guildId!, client).InitEmbed('category'));
        await interaction.message.edit({ embeds: [embed], components: [buttonRow] });
        interaction.deleteReply()
        break
    }
    return
  }
  @SelectMenuComponent({ id: 'ticket-config-log' })
  @Guard(IsAuthor)
  private async HandleChannelConfig(interaction: ChannelSelectMenuInteraction, client: Client): Promise<unknown> {
    await interaction.deferReply()
    if (interaction.message.interaction?.user.id !== interaction.user.id) {
      return interaction.followUp({ content: "You can't do that!" })
    }
    const val = interaction.values[0]
    if (!val) {
      return interaction.followUp("... you've selected something wong")
    }
    const data = await TicketConfig.findOneAndUpdate({ guild: interaction.guildId }, {
      logchannel: val
    })
    if (!data) {
      await new TicketConfig({
        guild: interaction.guildId,
        logchannel: val
      }).save()
    }
    interaction.followUp(`You've set the channel to <#${val}>`).then(x => {
      setTimeout(() => {
        try {
          if (x.deletable) {
            x.delete()
          }
        } catch (e) {
          throw e
        }
      }, 1000)

    })
    const { embed, buttonRow } = await new TicketLogEmbed(interaction.guildId!, client).InitEmbed('init')
    interaction.message.edit({ embeds: [embed], components: [buttonRow] })
    return;
  }
  @SelectMenuComponent({ id: 'ticket-config-channel' })
  @Guard(IsAuthor)
  private async ticketChannel(interaction: ChannelSelectMenuInteraction, client: Client) {
    await interaction.deferReply()
    const val = interaction.values[0]
    if (!val) {
      return interaction.followUp("Something went wrong....")
    }
    const data = await TicketConfig.findOneAndUpdate({ guild: interaction.guildId! }, {
      channel: val
    })
    if (!data) {
      await new TicketConfig({
        guild: interaction.guildId!,
        channel: val
      }).save()
    }
    const { embed, buttonRow } = await new TicketLogEmbed(interaction.guildId!, client).InitEmbed('init')
    await interaction.message.edit({ embeds: [embed], components: [buttonRow] })
    interaction.followUp({
      content: `The new ticket channel has been set to <#${val}>`
    }).then(x => {
      setTimeout(() => {
        try {
          if (x.deletable) {
            x.delete()
          }
        } catch (e) {
          throw e
        }
      }, 1000);
    })
  }
  @SelectMenuComponent({ id: 'ticket-config-category' })
  @Guard(IsAuthor)
  private async TicketConfigCategory(interaction: ChannelSelectMenuInteraction, client: Client) {
    await interaction.deferReply()
    const val = interaction.values[0]
    if (!val) {
      return interaction.followUp("Something went wrong...")
    }
    const data = await TicketConfig.findOneAndUpdate({ guild: interaction.guildId }, {
      category: val
    })
    if (!data) {
      await new TicketConfig({
        guild: interaction.guildId,
        category: val
      }).save()
    }
    const { embed, buttonRow } = await new TicketLogEmbed(interaction.guildId!, client).InitEmbed("init")
    await interaction.message.edit({ embeds: [embed], components: [buttonRow] })
    interaction.followUp(`Category has been set to <#${val}>`).then(x => {
      setTimeout(() => {
        try {
          if (x.deletable) {
            x.delete()
          }
        } catch (e) {
          throw e
        }
      }, 2000);
    })
  }
}
