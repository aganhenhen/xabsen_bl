import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Ini kuncinya!
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Biar bisa dipake di AuthModule nanti
})
export class UsersModule {}
