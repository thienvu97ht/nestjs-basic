import { Controller, Get, Render, Res } from "@nestjs/common";
import { ChatsService } from "./chats.service";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @Render("index")
  Home() {
    return;
  }

  @Get("/get-all")
  async Chat(@Res() res) {
    const messages = await this.chatsService.findAll();
    res.json(messages);
  }
}
