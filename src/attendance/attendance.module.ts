import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { MinioService } from './minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]) 
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService,MinioService],
  exports: [AttendanceService] // Tambahin ini buat jaga-jaga kalau mau dipake module lain
})
export class AttendanceModule {}