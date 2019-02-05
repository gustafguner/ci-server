import * as mongoose from 'mongoose';

import { IBuild } from './interfaces/build';

const BuildSchema = new mongoose.Schema({
  commitId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  log: { type: String, required: true },
});

const Build = mongoose.model<IBuild>('Build', BuildSchema);
export default Build;
