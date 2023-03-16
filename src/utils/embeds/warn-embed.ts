import { EmbedBuilder, GuildMember, User } from "discord.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc)
export function WarnEmbed(target: GuildMember | User, moderator: GuildMember | User, reason: string) {
  const embed = new EmbedBuilder()
  embed.setTitle('Warn')
  embed.setDescription(`${target} has been warned by ${moderator} for ${reason}`)
  embed.setImage('https://media.tenor.com/uRElz56N3AsAAAAC/warning-the-lorax.gif')
  embed.setColor('Red')
  embed.setThumbnail(target.displayAvatarURL({}))
  return embed
}

interface IList {
  id: string;
  moderator: string;
  reason: string;
  time: Date
}
export function WarnListEmbed(user: User, data: IList[]) {
  let n = 0
  const embed = new EmbedBuilder()
  embed.setTitle('Warn List')
  embed.setAuthor({
    name: user.username + "'s Warn List",
    iconURL: user?.displayAvatarURL()
  })
  embed.setColor('Grey')
  embed.setThumbnail(user?.displayAvatarURL())
  embed.addFields(data.map((cb) => {
    return {
      name: `[${n += 1}] | ID: ${cb.id}`,
      value: `Moderator: <@${cb.moderator}>\nReason: ${cb.reason}\nDate: ${dayjs.utc(cb.time).format('YYYY/MM/DD hh:mm')} (UTC)`
    }
  }))
  return embed
}

export function WarnRemoveEmbed(user: User, moderator: User, id: string) {
  const embed = new EmbedBuilder()
  embed.setTitle('Warn Removed')
  embed.setAuthor({
    name: user.username,
    iconURL: user?.displayAvatarURL()
  })
  embed.setDescription(`${moderator} has removed warn from ${user} with ID: \`${id}\``)
  embed.setColor("Green")
  embed.setTimestamp()
  return embed
}
