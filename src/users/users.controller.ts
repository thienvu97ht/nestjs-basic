import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { IUser } from "./user.interface";
import { Public, ResponseMessage, User } from "src/decorator/customize";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
// @Controller({ path: "users", version: ["1"] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage("Create a new User")
  @ApiBody({
    type: CreateUserDto,
  })
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch user with pagination")
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    example: 10,
  })
  findAll(
    @Query("page") currentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(":id")
  @Public()
  @ResponseMessage("Fetch user by id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("Update a User")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a User")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
