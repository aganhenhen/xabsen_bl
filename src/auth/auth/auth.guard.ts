import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // Pastikan namanya 'canActivate', bukan 'activate'
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan. Silakan login dulu.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'HIDUPJOKOWI', // Harus sama dengan di AuthModule
      });
      
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau sudah expired');
    }
    
    return true; // Izinkan akses jika semua OK
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}