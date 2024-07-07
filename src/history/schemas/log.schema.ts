import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

// Schema que guarda la informacion en la base de datos de historial
export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Exclude()
  @Prop()
  method: string;

  @Exclude()
  @Prop()
  url: string;

  @Exclude()
  @Prop()
  userId: string;

  @Exclude()
  @Prop()
  origin: string;

  // El body puede tomar cualquier valor
  // aprovechando las caracteristicas
  // de NoSQL
  @Prop({ type: Object })
  body?: Record<string, any>;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
