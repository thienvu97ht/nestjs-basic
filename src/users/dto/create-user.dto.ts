import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
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

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password không được để trống!" })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Age không được để trống!" })
  age: number;

  @ApiProperty()
  @IsNotEmpty({ message: "Gender không được để trống!" })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Address không được để trống!" })
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Role không được để trống!" })
  role: string;

  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password không được để trống!" })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Age không được để trống!" })
  age: number;

  @ApiProperty()
  @IsNotEmpty({ message: "Gender không được để trống!" })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Address không được để trống!" })
  address: string;
}
