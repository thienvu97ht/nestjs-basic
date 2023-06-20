import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  name: string;

  @IsNotEmpty({ message: "Password không được để trống!" })
  password: string;

  address: string;
}
