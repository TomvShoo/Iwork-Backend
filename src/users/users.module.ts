import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { Reseña } from 'src/reseña/entities/reseña.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profesional,
      Reseña
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
