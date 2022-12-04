import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomRepository } from 'src/db/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userDto } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ ...userDto, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code == '23505') throw new ConflictException(error.detail);
      else throw new InternalServerErrorException();
    }
    return user;
  }
}
