import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
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
  @IsArray({ message: "Skills có định dạng array" })
  @IsString({ each: true, message: "Skill định dạng là string" })
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
  @IsNotEmpty({ message: "Description không được để trống!" })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: "StartDate không được để trống!" })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: "StartDate có định dạng là Date" })
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "EndDate không được để trống!" })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: "EndDate có định dạng là Date" })
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "IsActive không được để trống!" })
  isActive: boolean;
}
