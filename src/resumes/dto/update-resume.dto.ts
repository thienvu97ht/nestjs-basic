import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateResumeDto } from "./create-resume.dto";

export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

export class UpdateResumeStatusDto {
  @ApiProperty()
  status: string;
}
