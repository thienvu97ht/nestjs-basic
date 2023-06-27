import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle("Learn NestJS")
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup("api/:version/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Lưu lại token khi refresh trang
      defaultModelsExpandDepth: -1, // Ẩn thông tin các model khi khai báo Swagger
    },
  });
}
