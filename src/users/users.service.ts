import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { genSaltSync, hashSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);

    const user = await this.userModel.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashPassword,
    });
    return user;
  }

  async findAll() {
    const result = await this.userModel.find();
    return result;
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      return "Not found user";
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
