import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';

const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.string(),
});

const signInUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.string(),
});

type CreateUser = z.infer<typeof createUserSchema>;
type SignInUser = z.infer<typeof signInUserSchema>;
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UsePipes(new ZodValidationPipe(createUserSchema))
  @Post()
  async createUser(@Body() { username, password, role }: CreateUser) {
    return this.userService.createUser({ username, password, role });
  }

  @UsePipes(new ZodValidationPipe(signInUserSchema))
  @Post('/signin')
  async signIn(@Body() { username, password, role }: SignInUser) {
    return this.userService.signInUser({ username, password, role });
  }
}
