import { Controller, Get } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { MailerService } from "@nestjs-modules/mailer";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import {
  Subscriber,
  SubscriberDocument,
} from "src/subscribers/schemas/subscriber.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Job, JobDocument } from "src/jobs/schemas/job.schema";

@ApiTags("Mail")
@ApiBearerAuth()
@Controller("mail")
export class MailController {
  constructor(
    private readonly mailService: MailService,

    private readonly mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});

    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      const jobs = jobWithMatchingSkills.map((item) => ({
        name: item.name,
        company: item.salary,
        salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ",
        skills: item.skills,
      }));

      await this.mailerService.sendMail({
        to: "thien.vu97ht123@gmail.com",
        from: '"Support Team" <support@example.com>', // override default from
        subject: "Welcome to Nice App! Confirm your Email",
        template: "new-job",
        context: {
          receiver: subs.name,
          jobs,
        },
      });
    }
  }
}
