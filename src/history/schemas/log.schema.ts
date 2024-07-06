import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { Coordinates } from 'src/restaurants/search-options.dto';

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

  @Prop({ type: Object })
  body?: Record<string, any>;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
