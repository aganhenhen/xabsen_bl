import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users') // Rute utama: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register') // Rute: /auth/register
  async register(@Body() userData: any) {
    return this.usersService.register(userData);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('detail')
  async findOneByPost(@Body() body: { username: string }) {
    return this.usersService.findOne(body.username);
  }

  @Patch(':username')
  update(@Param('username') username: string, @Body() updateData: any) {
    return this.usersService.update(username, updateData);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }

}
