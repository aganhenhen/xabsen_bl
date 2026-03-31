import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '103.127.97.229',
      port: 5432,
      username: 'postgres',
      password: 'Rahasia!234',
      database: 'xabsen',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // disable in production
    }),
    UsersModule,
    AuthModule,
    AttendanceModule,
  ],
  controllers: [AppController,AuthController],
  providers: [AppService],
})
export class AppModule {}
