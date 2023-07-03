import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

class Company {
  @ApiProperty()
  @IsNotEmpty({ message: "Id company không được để trống!" })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: "Name company không được để trống!" })
  name: string;
}

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Skill không được để trống!" })
  skills: string[];

  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @ApiProperty()
  @IsNotEmpty({ message: "Salary không được để trống!" })
  salary: number;

  @ApiProperty()
  @IsNotEmpty({ message: "Quantity không được để trống!" })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: "Level không được để trống!" })
  level: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: "StartDate không được để trống!" })
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "EndDate không được để trống!" })
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "IsActive không được để trống!" })
  isActive: boolean;
}
