import { Category } from "@discordx/utilities";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";
import os from 'os'
@Discord()
@Category('General')
export class Status {
  @Slash({ name: 'status', description: "Bot Status" })
  async status(
    interaction: CommandInteraction
  ) {
    const cpus = os.cpus()
    const cpuUsage = ((cpus.reduce((acc, cpu) => acc + cpu.times.user, 0) / cpus.length) / 1000 / 1000).toFixed(2)
    const uptime = process.uptime()
    const totalmem = os.totalmem()
    const freemem = os.freemem()
    const embed = new EmbedBuilder()
    embed.setTitle('Bot Status')
    embed.setColor('Blurple')
    embed.addFields([
      {
        name: '🏓 Latency:',
        value: `\`\`\`${Date.now() - interaction.createdTimestamp}ms\`\`\``,
        inline: true
      },
      {
        name: '📈Uptime',
        value: `\`\`\`${Math.floor(uptime / 3600)}h ${Math.floor(uptime % 3600 / 60)}m ${Math.floor(uptime % 60)}s\`\`\``,
        inline: true
      },
      {
        name: '📋Dashboard:',
        value: '```Up!```',
        inline: true
      },
      {
        name: "\n\u200b",
        value: "\n\u200b"
      },
      {
        name: '💻CPU Usage:',
        value: `\`\`\`${cpuUsage}%\`\`\``,
        inline: true
      },
      {
        name: "🔻Ram Usage:",
        value: `\`\`\`${((totalmem - freemem) / 1024 / 1024).toFixed(2)}MB / ${(totalmem / 1024 / 1024).toFixed(2)}MB\`\`\``,
        inline: true
      },
      {
        name: "Shard:",
        value: `\`\`\`0\`\`\``,
        inline: true
      }
    ])

    const rows = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL('https://youtu.be/dQw4w9WgXcQ').setLabel("Dashboard").setEmoji("📋").setStyle(ButtonStyle.Link))
    await interaction.reply({ embeds: [embed], components: [rows as any] })
  }
}
