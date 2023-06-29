import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiProperty,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { Public, ResponseMessage } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

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

  @Post("/login")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @ApiBody({
    type: LoginPayload,
  })
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get("profile")
  getProfile(@Req() req) {
    return req.user;
  }

  @Post("/register")
  @Public()
  @ResponseMessage("Register a new user")
  @ApiBody({
    type: RegisterUserDto,
  })
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
