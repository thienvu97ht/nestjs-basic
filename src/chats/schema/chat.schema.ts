import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  email: string;

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
