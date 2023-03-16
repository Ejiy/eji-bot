import { model, Schema } from "mongoose";

interface IModlist {
  id: string;
  type: "roles" | "user";
}

export interface ITicket {
  guild: string;
  channel: string;
  category: string;
  logchannel: string;
  modlist: IModlist[];
}

interface ITicketChannel {
  guild: string;
  channel: string;
  user: string;
  id: string;
  opened: Date;
  status: 'closed' | 'open' | 'temp-close';
  type?: string;
  members: {
    id: string;
  }
}

const ChannelSchema = new Schema<ITicketChannel>({
  guild: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  opened: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true
  },
  members: [
    {
      id: {
        type: String,
        unique: true
      }
    }
  ]
})

const ConfigSchema = new Schema<ITicket>({
  guild: {
    type: String,
    required: true,
    unique: true
  },
  channel: {
    type: String,
  },
  category: {
    type: String,
    unique: true
  },
  logchannel: {
    type: String,
  },
  modlist: [
    {
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  ]
})

export const TicketChannel = model('ticket-channel', ChannelSchema)
export const TicketConfig = model('ticket-config', ConfigSchema)
