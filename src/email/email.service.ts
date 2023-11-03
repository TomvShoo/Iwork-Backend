import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(@InjectRepository(Email) private emailRepository: Repository<Email>,) {}

  async sendEmail(email: CreateEmailDto) {
    const { recipient, subject, message } = email;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Nrtdevops@gmail.com',
        pass: 'rmjc kkay yqnx hcpu'
      },
    });

    let mailOptions = {
      from: 'Nrtdevops@gmail.com',
      to: recipient,
      subject: subject,
      text: message,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('correo enviado' + info.response);
      return { message: 'correo enviado correctamente' };
    } catch (error) {
      console.error(error);
      throw new Error('Error al enviar el correo');
    }
  }

  create(createEmailDto: CreateEmailDto) {
    return this.sendEmail(createEmailDto);
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
