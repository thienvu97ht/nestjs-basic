import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/user.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // username/pass là 2 tham số mà thư viện passport trả về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser) {
    const { _id, name, email, role } = user;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);

    return {
      _id: newUser?._id,
      createdAt: newUser.createdAt,
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn:
        ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000,
    });

    return refresh_token;
  };
}
