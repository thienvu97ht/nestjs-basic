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
import { ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "src/users/user.interface";
import { CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeStatusDto } from "./dto/update-resume.dto";
import { ResumesService } from "./resumes.service";

@ApiTags("Resumes")
@ApiBearerAuth()
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create a new resume")
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch resumes with pagination")
  @ApiQuery({
    name: "populate",
    type: String,
    required: false,
    example: "companyId,jobId",
  })
  @ApiQuery({
    name: "fields",
    type: String,
    required: false,
    example: "companyId._id,companyId.name,companyId.logo,jobId._id,jobId.name",
  })
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get("/by-user")
  @ResponseMessage("Fetch a resumes by user")
  findOneByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }

  @Get(":id")
  @ResponseMessage("Fetch a resume by id")
  findOne(@Param("id") id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("Update status resume")
  @ApiBody({
    type: UpdateResumeStatusDto,
  })
  update(
    @Param("id") id: string,
    @Body("status") status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a resume")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
