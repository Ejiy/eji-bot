import { channel } from "diagnostics_channel";
import { ActionRow, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ChannelType, CommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder, StringSelectMenuBuilder } from "discord.js";
import { Client } from "discordx";
import { ITicket, TicketConfig } from "../../database/index.js";



const config = [
  { label: "Set Channel", value: 'set-channel' },
  { label: "Set Category", value: 'set-category' },
  { label: "Set Log", value: "set-log" }
]


export class TicketLogEmbed {
  private guildId: string;
  private client: Client;
  private ticketConfig: ITicket | null
  constructor(guildId: string, client: Client) {
    this.guildId = guildId;
    this.client = client;
    this.ticketConfig = null
  }

  public async fetchTicketConfig(): Promise<void> {
    this.ticketConfig = await TicketConfig.findOne({ guild: this.guildId })
  }

  public async InitEmbed(type: "init" | "category" | "log" | "channel"): Promise<{ embed: EmbedBuilder, buttonRow: ActionRowBuilder<MessageActionRowComponentBuilder> }> {
    await this.fetchTicketConfig()
    switch (type) {
      default:
        const testembed = new EmbedBuilder()
          .setTitle("Testing")

        const testmenu = new StringSelectMenuBuilder().addOptions(config).setCustomId('not-id')
        const testRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(testmenu)
        return {
          embed: testembed,
          buttonRow: testRow
        }
      case "init":
        const cfgembed = new EmbedBuilder()
        cfgembed.setTitle("Ticket Config")
        cfgembed.setColor("Gold")
        cfgembed.addFields([
          {
            name: "Ticket Channel:",
            value: this.ticketConfig?.channel ? `<#${this.ticketConfig?.channel}>` : "Not set",
            inline: true
          },
          {
            name: "Category:",
            value: this.ticketConfig?.category ? `<#${this.ticketConfig?.category}>` : "Not set",
            inline: true
          },
          {
            name: "Log Channel:",
            value: this.ticketConfig?.logchannel ? `<#${this.ticketConfig?.logchannel}>` : "Not set",
            inline: true
          }
        ])
        cfgembed.setThumbnail(this.client.user?.displayAvatarURL()!)
        const cfgMenu = new StringSelectMenuBuilder().addOptions(config).setCustomId('ticket-config');
        const cfgButtonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(cfgMenu)
        return {
          embed: cfgembed,
          buttonRow: cfgButtonRow
        }
      case "log":
        const logembed = new EmbedBuilder()
          .setTitle("Log Channel")
          .setDescription("Current Channel: " + this.ticketConfig?.logchannel ? `<#${this.ticketConfig?.logchannel}>` : "Not set")
          .setColor("Gold")
          .setThumbnail(this.client.user?.displayAvatarURL()!)
        const logmenu = new ChannelSelectMenuBuilder({
          placeholder: "Select Log Channel",
          customId: "ticket-config-log",
          max_values: 1,
          channelTypes: [ChannelType.GuildText]
        })

        const logButtonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(logmenu);

        return {
          embed: logembed,
          buttonRow: logButtonRow
        }
      case "channel":
        const channelEmbed = new EmbedBuilder()
          .setTitle("Ticket Channel")
          .setFields([{
            name: "Current Channel:",
            value: this.ticketConfig?.channel ? `<#${this.ticketConfig?.channel}>` : "Not set",
          }])
          .setColor("Gold")

        const channelmenu = new ChannelSelectMenuBuilder({
          placeholder: "Select Channel",
          customId: "ticket-config-channel",
          max_values: 1,
          channelTypes: [ChannelType.GuildText]
        })
        const channelButtonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(channelmenu)

        return {
          embed: channelEmbed,
          buttonRow: channelButtonRow
        }
      case "category":
        const categoryEmbed = new EmbedBuilder()
          .setTitle("Category Channel")
          .setFields([
            {
              name: "Current Category:",
              value: this.ticketConfig?.category ? `<#${this.ticketConfig?.category}` : "Not set"
            }
          ])
          .setColor("Gold")
        const categoryMenu = new ChannelSelectMenuBuilder({
          placeholder: "Select Category",
          customId: "ticket-config-category",
          max_values: 1,
          channelTypes: [ChannelType.GuildCategory]
        })
        const categoryRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(categoryMenu)

        return {
          embed: categoryEmbed,
          buttonRow: categoryRow
        }
    }
  }

}
