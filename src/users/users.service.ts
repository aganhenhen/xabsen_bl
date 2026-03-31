import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { genSalt, hash } from 'bcrypt';

interface RegisterDto {
  password: string;
  [key: string]: any;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async register(data: RegisterDto) {
    const salt: string = await genSalt(10);
    const hashedPassword: string = await hash(data.password, salt);

    const newUser = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(username: string) {
    const user = await this.findUserByUsername(username);
    const { password, ...result } = user;
    return result;
  }
  
  async update(username: string, updateData: any) {
    const user = await this.findOne(username);
    await this.usersRepository.update({ username }, updateData);
    return this.findOne(username);
  }

  async remove(username: string) {
    const user = await this.findUserByUsername(username);
    await this.usersRepository.remove(user);
    return { message: `User ${username} berhasil dihapus` };
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) throw new NotFoundException(`User ${username} tidak ditemukan`);
    return user;
  }

}
