import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  /**
   * Metodo que guarda un log en la base de datos de la transaccion
   * @param log Log que guarda la informacion del request realizado
   * @returns Log guardado en la base de datos
   */
  async createLog(log: Log): Promise<Log> {
    const createdLog = new this.logModel(log);
    return createdLog.save();
  }

  /**
   * Metodo disponible para usuarios admin
   * @returns Todos los logs realizados por los usuarios
   */
  async getAllLogs(): Promise<Log[]> {
    return this.logModel.find().sort({ timestamp: 'desc' }).exec();
  }

  /**
   * Metodo disponible para usuarios customer y admin
   * @param userId id del usuario
   * @returns Logs del usuario
   */
  async getLogsByUser(userId: string): Promise<Log[]> {
    const userLogs = await this.logModel
      .find({ userId })
      .sort({ timestamp: 'desc' })
      .exec();

    return userLogs.map((log) => plainToClass(Log, log.toObject()));
  }
}
