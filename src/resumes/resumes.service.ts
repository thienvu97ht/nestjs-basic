import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import mongoose from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/users/user.interface";
import { CreateUserCvDto } from "./dto/create-resume.dto";
import { Resume, ResumeDocument } from "./schemas/resume.schema";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createResumeDto: CreateUserCvDto, user: IUser) {
    const newCV = await this.resumeModel.create({
      ...createResumeDto,
      userId: user._id,
      status: "PENDING",
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    });

    return {
      _id: newCV._id,
      createAt: newCV.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found resume`);
    }

    return await this.resumeModel.findById(id);
  }

  async findByUser(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id,
    });
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("Not found resume");
    }

    const updated = await this.resumeModel.updateOne(
      {
        _id,
      },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
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

    return this.resumeModel.softDelete({
      _id: id,
    });
  }
}
