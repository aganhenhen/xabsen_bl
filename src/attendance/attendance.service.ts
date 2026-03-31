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
    return { status: 'Thank You For Your Hard Work', data: attendance };
  }

  async toggleAttendance(userId: number, data: any) {
    // 1. Cari dulu: Apakah ada absen yang statusnya "masih menggantung" (belum check-out)?
    const lastAttendance = await this.attendanceRepository.findOne({
      where: { userId },
      order: { check_in: 'DESC' }, // Ambil yang paling baru
    });

    const clientTime = data.customTime ? new Date(data.customTime) : new Date();

    // SKENARIO A: Belum pernah absen ATAU absen terakhir sudah ditutup (sudah check-out)
    if (!lastAttendance || lastAttendance.check_out) {
      // Validasi tambahan: tidak boleh check-in 2x di tanggal yang sama (opsional)
      const today = clientTime.toISOString().split('T')[0];
      if (lastAttendance && lastAttendance.checkin_date === today) {
        throw new BadRequestException('Anda sudah absen hari ini.');
      }

      // Lakukan CHECK-IN
      const newIn = this.attendanceRepository.create({
        userId,
        checkin_date: clientTime.toISOString().split('T')[0],
        check_in: clientTime,
        check_in_coordinate: data.coordinate,
        check_in_addr: data.address,
        notes: data.notes,
      });
      return await this.attendanceRepository.save(newIn);
    }

    // SKENARIO B: Ada data terakhir tapi check_out-nya masih NULL
    if (!lastAttendance.check_out) {
      const diffHours = (clientTime.getTime() - lastAttendance.check_in.getTime()) / (1000 * 60 * 60);
      if (diffHours > 24) {
        throw new BadRequestException('Absen sebelumnya sudah kadaluarsa (lebih dari 24 jam).');
      }

      lastAttendance.check_out = clientTime;
      lastAttendance.check_out_coordinate = data.coordinate;
      lastAttendance.check_out_addr = data.address;
      return await this.attendanceRepository.save(lastAttendance);
    }
  }
  async getMonthlyReport(userId: number, year: number, month: number) {
    const y = Number(year);
    const m = Number(month);

    const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
    const lastDayDate = new Date(y, m, 0);
    const lastDay = `${y}-${String(m).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

    console.log(`Searching from ${firstDay} to ${lastDay} for user ${userId}`);

    return await this.attendanceRepository.find({
      where: {
        userId: userId,
        checkin_date: Between(firstDay, lastDay),
      },
      relations: ['user'],
      order: { checkin_date: 'ASC' },
    });
  }

  async getHistoryByUsername(body: { username: string; year: number; month: number }) {
  const { username, year, month } = body;
  const y = Number(year);
  const m = Number(month);

  const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
  const lastDayDate = new Date(y, m, 0);
  const lastDay = `${y}-${String(m).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

  const results = await this.attendanceRepository.find({
    where: {
      user: { username: username },
      checkin_date: Between(firstDay, lastDay),
    },
    relations: ['user'],
    order: { checkin_date: 'DESC' },
  });

  if (results.length === 0) return { user: null, logs: [] };

  const userInfo = results[0].user;

  const logs = results.map(item => {
    const { user, ...logData } = item;
    return logData;
  });


  return {
    user: {
      id: userInfo.id,
      username: userInfo.username,
      fullName: userInfo.fullName,
      position: userInfo.position
    },
    logs: logs
  };
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