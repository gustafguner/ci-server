import * as mongoose from 'mongoose';

import { IBuild } from './interfaces/build';

const Response = {
  success: { type: Boolean, required: true },
  type: { type: String, required: false },
  message: { type: String, required: true },
};

const BuildSchema = new mongoose.Schema({
  commitId: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now() },
  response: { type: Response, required: true },
});

const Build = mongoose.model<IBuild>('Build', BuildSchema);
export default Build;
