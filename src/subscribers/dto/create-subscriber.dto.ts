import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Skill không được để trống!" })
  @IsArray({ message: "Skill có định dạng là array!" })
  @IsString({ each: true, message: "Skill định dạng là string!" })
  skills: string[];
}
