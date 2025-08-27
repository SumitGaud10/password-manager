import mongoose, { Schema } from "mongoose";

const recordsSchema: Schema = new mongoose.Schema({
  website: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

export const Records =
  mongoose.models.Records || mongoose.model("Records", recordsSchema);
