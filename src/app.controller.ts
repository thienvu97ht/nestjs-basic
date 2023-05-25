import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

class LoginPayload {
  username: string;
  password: string;
}
@ApiTags("Auth")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("/login")
  @ApiBody({ type: LoginPayload })
  handleLogin(@Request() req) {
    return req.user;
  }
}
