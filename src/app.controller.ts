import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";

class LoginPayload {
  @ApiProperty({ example: "thien.vu97ht@gmail.com" })
  username: string;

  @ApiProperty({ example: "123456" })
  password: string;
}
@ApiTags("Auth")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ApiBody({
    type: LoginPayload,
  })
  handleLogin(@Request() req) {
    return req.user;
  }
}
