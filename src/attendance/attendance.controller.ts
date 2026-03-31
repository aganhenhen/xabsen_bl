import { Controller, Get, Post, Body, Patch, Param, Request, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '../auth/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Get('status')
  getStatus(@Request() req, @Query('date') date?: string) {
    return this.attendanceService.getStatus(req.user.sub, date);
  }
  @Post('press-button')
  pressButton(@Request() req, @Body() data: any) {
    return this.attendanceService.toggleAttendance(req.user.sub, data);
  }

  @Get('history')
  async getMyMonthly(
    @Request() req,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    const m = month ? parseInt(month) : new Date().getMonth() + 1;
    return this.attendanceService.getMonthlyReport(req.user.sub, y, m);
  }

  @Get('admin/recap')
  async getAdminRecap(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    const m = month ? parseInt(month) : new Date().getMonth() + 1;
    return this.attendanceService.getAllReport(y, m);
  }

  @Post('history-by-user')
  async getHistoryByUser(@Body() body: { username: string; year: number; month: number }) {
    // Kalau year/month tidak dikirim di body, kita kasih default hari ini
    const payload = {
      username: body.username,
      year: body.year || new Date().getFullYear(),
      month: body.month || new Date().getMonth() + 1,
    };

    return this.attendanceService.getHistoryByUsername(payload);
  }
}

