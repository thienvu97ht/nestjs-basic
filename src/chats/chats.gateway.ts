import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    client: Socket,
    payload: CreateChatDto,
  ): Promise<void> {
    await this.chatsService.create(payload);
    this.server.emit("recMessage", payload);
  }

  afterInit(server: Server) {
    // console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}
