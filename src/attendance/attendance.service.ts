import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) { }

  async getStatus(userId: number) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { userId, checkin_date: today }
    });

    if (!attendance) return { status: 'READY_TO_CHECKIN', data: null };
    if (!attendance.check_out) return { status: 'READY_TO_CHECKOUT', data: attendance };
    return { status: 'ALREADY_FINISHED', data: attendance };
  }

  async toggleAttendance(userId: number, data: any) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { userId, checkin_date: today }
    });

    // SKENARIO 1: Belum absen sama sekali hari ini -> CHECK-IN
    if (!attendance) {
      const newIn = this.attendanceRepository.create({
        userId,
        checkin_date: today,
        check_in: new Date(),
        check_in_coordinate: data.coordinate,
        check_in_addr: data.address,
        notes: data.notes,
      });
      return await this.attendanceRepository.save(newIn);
    }

    // SKENARIO 2: Sudah check-in tapi belum check-out -> CHECK-OUT
    if (!attendance.check_out) {
      attendance.check_out = new Date();
      attendance.check_out_coordinate = data.coordinate;
      attendance.check_out_addr = data.address;
      return await this.attendanceRepository.save(attendance);
    }

    // SKENARIO 3: Sudah lengkap masuk & pulang
    throw new BadRequestException('Anda sudah menyelesaikan absensi hari ini.');
  }
  async getMonthlyReport(userId: number, year: number, month: number) {
    // Membuat rentang tanggal awal dan akhir bulan
    // Contoh: Month 3 (Maret) -> 2026-03-01 sampai 2026-03-31
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.attendanceRepository.find({
      where: {
        userId: userId,
        checkin_date: Between(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        ),
      },
      order: { checkin_date: 'ASC' },
    });
  }

  async getAllReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    return await this.attendanceRepository.find({
      where: {
        checkin_date: Between(startDate, endDate),
      },
      relations: ['user'],
      order: { checkin_date: 'DESC' },
    });
  }
}