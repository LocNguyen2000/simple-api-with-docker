import mongoose from 'mongoose';

const LoggerSchema = new mongoose.Schema(
  {
    logLevel: { type: String, required: true, enum: ['Error', 'Warning', 'Info'], default: 'Info' },
    user: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Logger = mongoose.model('Log', LoggerSchema);

export default Logger;
