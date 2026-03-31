import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'HIDUPJOKOWI', // Nanti pindahin ke .env ya
      signOptions: { expiresIn: '1d' }, // Token berlaku 1 hari
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}