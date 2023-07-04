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
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "src/users/user.interface";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobsService } from "./jobs.service";

@ApiTags("Job")
@ApiBearerAuth()
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create a new job")
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch jobs with pagination")
  @ApiQuery({
    name: "current",
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: "pageSize",
    type: Number,
    required: false,
    example: 10,
  })
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(":id")
  @Public()
  @ResponseMessage("Fetch a job by id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("Update a job")
  update(
    @Param("id") id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a job")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
