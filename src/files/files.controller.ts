import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  MultipleFilesFormDataDTO,
  SingleFileFormDataDTO,
} from "./dto/create-file.dto";
import { FilesService } from "./files.service";

@ApiTags("Upload")
@ApiBearerAuth()
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: SingleFileFormDataDTO })
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024, // 1 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @Post("multi-upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: MultipleFilesFormDataDTO })
  @UseInterceptors(FilesInterceptor("files"))
  uploadMultiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
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
  update(@Param("id") id: string) {
    return this.filesService.update(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(+id);
  }
}
