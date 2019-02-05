import * as mongoose from 'mongoose';

import { IResponse } from './response';

export interface IBuild extends mongoose.Document {
  commitId: string;
  timestamp: Date;
  response: IResponse;
}
