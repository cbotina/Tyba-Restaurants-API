import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { Model } from 'mongoose';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(log: Log): Promise<Log> {
    const createdLog = new this.logModel(log);
    return createdLog.save();
  }
}
