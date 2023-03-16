import { Schema, model } from 'mongoose';
import { GenerateID } from '../../utils/index.js';

interface IWarns {
  moderator: string;
  reason: string;
  time: Date;
  id: string;
}

interface IWarn {
  guild: string;
  user: string;
  warns: IWarns[]
};

const IWarnSchema = new Schema<IWarn>({
  guild: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: String,
    required: true,
    unique: true
  },
  warns: [
    {
      id: {
        type: String,
        required: true,
        unique: true,
        default: GenerateID()
      },
      moderator: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true
      },
      time: {
        type: Date,
        required: false,
        default: Date.now()
      }
    }
  ]
})

export const Warn = model('warns', IWarnSchema)
