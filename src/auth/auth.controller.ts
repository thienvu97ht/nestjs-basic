import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
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
