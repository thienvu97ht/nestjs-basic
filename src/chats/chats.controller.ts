import { Controller, Get, Render } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Chats")
@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @Render("index")
  home() {
    return;
  }

  @Get("/get-all")
  findAll() {
    return this.chatsService.findAll();
  }
}
