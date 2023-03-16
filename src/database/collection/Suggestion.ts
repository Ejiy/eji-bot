import { Schema, model } from "mongoose";

interface ISuggestion {
  guild: string;
  user: string;
  status: 'waiting' | 'accepted' | 'denied';
}

const SuggestionSchema = new Schema<ISuggestion>({
  guild: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'waiting'
  }
})

export const Suggestion = model('suggestions', SuggestionSchema)
