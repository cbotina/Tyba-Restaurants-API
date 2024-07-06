import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(log: Log): Promise<Log> {
    const createdLog = new this.logModel(log);
    return createdLog.save();
  }

  async getAllLogs(): Promise<Log[]> {
    return this.logModel.find().sort({ timestamp: 'desc' }).exec();
  }

  async getLogsByUser(userId: string): Promise<Log[]> {
    const userLogs = await this.logModel
      .find({ userId })
      .sort({ timestamp: 'desc' })
      .exec();

    return userLogs.map((log) => plainToClass(Log, log.toObject()));
  }
}
