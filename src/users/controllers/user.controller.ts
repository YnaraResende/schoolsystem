import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IUser } from '../schemas/models/user.interface';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() user: IUser) {
    return this.userService.createUser(user);
  }

  @Post('/signin')
  async signIn(@Body() user: IUser) {
    return this.userService.signInUser(user);
  }
}
