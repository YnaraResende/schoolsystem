import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserMongooseRepository } from './repositories/mongoose/user.mongoose.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMongooseRepository,
    },
    UserService,
  ],
})
export class UsersModule {}
