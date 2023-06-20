import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";

class LoginPayload {
  @ApiProperty({ example: "thien.vu97ht@gmail.com" })
  username: string;

  @ApiProperty({ example: "123456" })
  password: string;
}
@ApiTags("Auth")
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ApiBody({
    type: LoginPayload,
  })
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
