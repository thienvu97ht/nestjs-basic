import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseMessage } from "src/decorator/customize";
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
  @ResponseMessage("Upload single file")
  @ApiHeader({
    name: "folder_type",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: SingleFileFormDataDTO })
  @UseInterceptors(FileInterceptor("fileUpload"))
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
    return {
      fileName: file.filename,
    };
  }

  @Post("multi-upload")
  @ResponseMessage("Upload multi file")
  @ApiHeader({
    name: "folder_type",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: MultipleFilesFormDataDTO })
  @UseInterceptors(FilesInterceptor("files"))
  uploadMultiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
}
