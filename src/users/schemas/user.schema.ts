import { IUser } from './models/user.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class User implements IUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
