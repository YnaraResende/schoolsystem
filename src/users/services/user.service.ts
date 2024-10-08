import { UserRepository } from '../repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ID format');
    }
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(user) {
    return this.userRepository.createUser(user);
    return { message: 'User created successfully' };
  }

  async signInUser(user) {
    return this.userRepository.signInUser(user);
    return { message: 'User successfully logged' };
  }
}
