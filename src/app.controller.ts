import { Controller, Get, Render } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("Home")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get() // route " " /=> api (restful)
  @Render("home")
  getHello() {
    console.log("check port: ", this.configService.get<string>("PORT"));

    const message = this.appService.getHello();

    return {
      message,
    };
  }
}
