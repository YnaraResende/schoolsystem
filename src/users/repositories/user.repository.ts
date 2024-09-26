import { IUser } from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract getUserById(id: string): Promise<IUser>;
  abstract createUser(user: IUser): Promise<void>;
  abstract signInUser(user: IUser): Promise<string>;
}
