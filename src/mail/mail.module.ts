import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscriber } from "rxjs";
import { SubscriberSchema } from "src/subscribers/schemas/subscriber.schema";
import { Job, JobSchema } from "src/jobs/schemas/job.schema";

//mail.module.ts
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          secure: false,
          auth: {
            user: configService.get<string>("EMAIL_AUTH_USER"),
            pass: configService.get<string>("EMAIL_AUTH_PASSWORD"),
          },
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobSchema },
    ]),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
