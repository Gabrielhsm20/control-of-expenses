import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailOptions } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail(options: SendMailOptions): Promise<boolean> {
    const sended = await this.mailerService.sendMail(options);
    return sended ? true : false;
  }
}
