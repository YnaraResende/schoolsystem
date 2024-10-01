import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserController } from '../../src/users/controllers/user.controller';
import { UserService } from '../../src/users/services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            createUser: jest.fn(),
            signInUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should return a user by id', async () => {
    const mockUser = { id: '123', username: 'Luiz', role: 'professor' };
    jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

    const result = await controller.getUserById('123');
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest
      .spyOn(service, 'getUserById')
      .mockRejectedValue(new NotFoundException('User not found'));

    await expect(controller.getUserById('123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a user', async () => {
    const mockUser = {
      username: 'John',
      password: 'passteste',
      role: 'professor',
    };
    jest
      .spyOn(service, 'createUser')
      .mockResolvedValue({ message: 'User created successfully' });

    const result = await controller.createUser(mockUser);
    expect(result).toEqual({ message: 'User created successfully' });
  });

  it('should sign in a user', async () => {
    const mockUser = { username: 'john', password: 'pass123' };
    jest
      .spyOn(service, 'signInUser')
      .mockResolvedValue({ message: 'User created successfully' });

    const result = await controller.signIn(mockUser);
    expect(result).toEqual({ message: 'User created successfully' });
  });
});
