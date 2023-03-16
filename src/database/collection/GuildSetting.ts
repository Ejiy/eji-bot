import { ColorResolvable } from "discord.js";
import { Schema } from "mongoose";

interface ISuggestion {
  channel: string;
  colors: {
    waiting: ColorResolvable,
    denied: ColorResolvable,
    accepted: ColorResolvable
  }
}

interface IWarn {

}

interface ILogs {
  default: string;
  moderation: string;
}

interface Setting {
  suggestion: ISuggestion;
  warn: IWarn;
  logs: ILogs;
}

interface IGuild {
  guild: string;
  setting: Setting
}

const GuildSchema = new Schema<IGuild>({
  guild: {
    type: String,
    required: true,
  },
  setting: {
    suggestion: {
    },
    logs: {

    }
  }
})
