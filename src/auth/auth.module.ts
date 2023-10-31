import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { ProfesionalModule } from 'src/profesional/profesional.module';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [
    UsersModule,
    ProfesionalModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,]
})
export class AuthModule {}
