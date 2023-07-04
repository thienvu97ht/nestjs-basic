import { ApiFile } from "src/decorator/customize";

export class SingleFileFormDataDTO {
  @ApiFile()
  fileUpload: Express.Multer.File;
}

export class MultipleFilesFormDataDTO {
  @ApiFile({ isArray: true })
  files: Express.Multer.File[];
}
