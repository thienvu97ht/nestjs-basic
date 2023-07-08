import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "UserId không được để trống!" })
  userId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: "Url không được để trống!" })
  url: string;

  @IsNotEmpty({ message: "Status không được để trống!" })
  status: string;

  @ApiProperty()
  @IsNotEmpty({ message: "CompanyId không được để trống!" })
  companyId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: "JobId không được để trống!" })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Url không được để trống!" })
  url: string;

  status: string;

  @ApiProperty()
  @IsNotEmpty({ message: "CompanyId không được để trống!" })
  @IsMongoId({ message: "CompanyId là mongo ID!" })
  companyId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: "JobId không được để trống!" })
  @IsMongoId({ message: "JobId là mongo ID!" })
  jobId: mongoose.Schema.Types.ObjectId;
}
