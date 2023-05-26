import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "./schema/chat.schema";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return await this.chatModel.create(createChatDto);
  }

  async findAll() {
    const result = await this.chatModel.find();
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
