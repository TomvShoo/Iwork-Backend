import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ProfesionalModule } from './profesional/profesional.module';
import { CartaTrabajoModule } from './carta-trabajo/carta-trabajo.module';
import { ProfesionModule } from './profesion/profesion.module';
import { PortafolioModule } from './portafolio/portafolio.module';
import { AuthModule } from './auth/auth.module';
import { ReseñaModule } from './reseña/reseña.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'tomaspassword',
      database: 'iworkdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true 
    }),
    UsersModule,
    ProfesionalModule,
    CartaTrabajoModule,
    ProfesionModule,
    PortafolioModule,
    AuthModule,
    ReseñaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
