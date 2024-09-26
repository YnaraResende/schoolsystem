import { UserRepository } from '../user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../../schemas/models/user.interface';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class UserMongooseRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  getUserById(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec();
  }

  async createUser(user: IUser): Promise<void> {
    user.password = await bcrypt.hash(user.password, 8);
    const newUser = new this.userModel(user);
    await newUser.save();
  }

  async signInUser(newUser: IUser): Promise<string> {
    const { username, password } = newUser;
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      password.toString(),
      user.password.toString(),
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return access_token;
  }
}
