import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name không được để trống!" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "ApiPath không được để trống!" })
  apiPath: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Method không được để trống!" })
  method: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Module không được để trống!" })
  module: string;
}
