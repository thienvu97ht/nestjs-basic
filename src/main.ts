import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

  app.useGlobalPipes(new ValidationPipe());

  // config CORS
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  });

  // config swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Learn NestJS")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearerAuth: [] }];

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Ẩn thông tin các model khi khai báo Swagger
    },
  });

  await app.listen(configService.get<string>("PORT"));
}

bootstrap();
