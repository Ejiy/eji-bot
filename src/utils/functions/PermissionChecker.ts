import { CommandInteraction, PermissionResolvable } from "discord.js";
import { Guard, GuardFunction, ArgsOf } from "discordx";

export const HasPermission: GuardFunction<CommandInteraction> = async (interaction, client, next, permission) => {
  return next()
}
