import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { IUser } from "./user.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    // add logic check email
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (isExist) {
      throw new BadRequestException(
        `Email ${createUserDto.email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = this.getHashPassword(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .select("-password")
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id).select("-password");
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

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    try {
      await this.userModel.updateOne(
        {
          _id: id,
        },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      return this.userModel.softDelete({
        _id: id,
      });
    } catch (error) {
      return "Not found user";
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.getHashPassword(registerUserDto.password);

    // add logic check email
    const isExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });

    if (isExist) {
      throw new BadRequestException(
        `Email ${registerUserDto.email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }

    const newRegister = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: "USER",
    });

    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      {
        _id,
      },
      {
        refreshToken,
      },
    );
  };
}
