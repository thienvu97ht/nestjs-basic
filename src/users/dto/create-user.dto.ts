import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail({}, { message: "Email không đúng định dạng!" })
  @IsNotEmpty({ message: "Email không được để trống!" })
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password không được để trống!" })
  password: string;

  @ApiProperty()
  address: string;
}
