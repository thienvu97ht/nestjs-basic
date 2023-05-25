import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

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

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {
        _id: id,
      },
      updateUserDto,
    );
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({
        _id: id,
      });
    } catch (error) {
      return "Not found user";
    }
  }
}