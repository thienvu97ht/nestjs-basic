import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Address không được để trống!" })
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Description không được để trống!" })
  description: string;
}
