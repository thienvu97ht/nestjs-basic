import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Permission,
  PermissionSchema,
} from "src/permissions/schemas/permission.schema";
import { Role, RoleSchema } from "src/roles/schemas/role.schema";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { DatabasesController } from "./databases.controller";
import { DatabasesService } from "./databases.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    UsersModule,
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule {}
