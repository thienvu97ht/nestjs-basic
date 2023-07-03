import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiFile } from "src/decorator/customize";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FilesService } from "./files.service";

@ApiTags("Upload")
@ApiBearerAuth()
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiFile("file")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(+id);
  }
}
