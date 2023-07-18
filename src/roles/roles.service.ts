import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import mongoose from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { ADMIN_ROLE } from "src/databases/sample";
import { IUser } from "src/users/user.interface";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./schemas/role.schema";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name } = createRoleDto;

    const isExist = await this.roleModel.findOne({
      name,
    });

    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" đã tồn tại!`);
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate({
        path: "permissions",
        select: {
          apiPath: 1,
          name: 1,
          method: 1,
        },
      })
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
      return await this.roleModel.findById(id).populate({
        path: "permissions",
        select: {
          apiPath: 1,
          name: 1,
          method: 1,
        },
      });
    } catch (error) {
      return "Not found permission";
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Not found role");
    }

    // const { name } = updateRoleDto;
    // const isExist = await this.roleModel.findOne({
    //   name,
    // });

    // if (isExist) {
    //   throw new BadRequestException(`Role với name="${name}" đã tồn tại!`);
    // }

    return await this.roleModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if (foundRole.name === ADMIN_ROLE) {
      throw new BadRequestException("Không thể xoá role ADMIN!");
    }

    try {
      await this.roleModel.updateOne(
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

      return this.roleModel.softDelete({
        _id: id,
      });
    } catch (error) {
      return "Not found role";
    }
  }
}
