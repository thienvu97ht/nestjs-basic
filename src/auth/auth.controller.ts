import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/user.interface";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { RolesService } from "src/roles/roles.service";

class LoginPayload {
  @ApiProperty({ example: "admin@gmail.com" })
  username: string;

  @ApiProperty({ example: "123456" })
  password: string;
}
@ApiTags("Auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RolesService,
  ) {}

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

  @Post("/register")
  @Public()
  @ResponseMessage("Register a new user")
  @ApiBody({
    type: RegisterUserDto,
  })
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get("profile")
  getProfile(@Req() req) {
    return req.user;
  }

  @Get("account")
  @ResponseMessage("Get user information")
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.roleService.findOne(user.role._id)) as any;
    console.log("🏆 ~ AuthController ~ handleGetAccount ~ temp:", temp);
    user.permissions = temp.permissions;
    return { user };
  }

  @Get("refresh")
  @Public()
  @ResponseMessage("Get user refresh token")
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post("logout")
  @ResponseMessage("Logout user")
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
