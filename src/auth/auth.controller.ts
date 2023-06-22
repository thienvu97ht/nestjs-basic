import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { Public } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";

class LoginPayload {
  @ApiProperty({ example: "thien.vu97ht@gmail.com" })
  username: string;

  @ApiProperty({ example: "123456" })
  password: string;
}
@ApiTags("Auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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
