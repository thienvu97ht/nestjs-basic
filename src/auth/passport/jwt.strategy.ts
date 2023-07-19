import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RolesService } from "src/roles/roles.service";
import { IUser } from "src/users/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {
    super({
      // Giải mã token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;
    const userRole = role as unknown as { _id: string; name: string };
    const temp = (
      (await this.rolesService.findOne(userRole._id)) as any
    ).toObject();

    // Lưu vào req.user sau khi giải mã token
    return {
      _id,
      name,
      email,
      role,
      permissions: temp?.permissions ?? [],
    };
  }
}
