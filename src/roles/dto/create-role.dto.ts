import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Description không được để trống!" })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: "IsActive không được để trống!" })
  @IsBoolean({ message: "IsActive có giá trị boolean!" })
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: "Permissions không được để trống!" })
  @IsMongoId({ each: true, message: "Each permissions là mongo object ID!" })
  @IsArray({ message: "Permissions có định dạng là array!" })
  permissions: mongoose.Schema.Types.ObjectId[];
}
