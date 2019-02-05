import * as mongoose from 'mongoose';

export interface IBuild extends mongoose.Document {
  commitId: string;
  timestamp: Date;
  log: string;
}
