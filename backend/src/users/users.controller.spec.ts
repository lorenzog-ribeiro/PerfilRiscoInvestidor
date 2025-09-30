import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { IUserRepository } from './user-interface';

describe('UsersController', () => {
  // Changed 'Controller' to 'UsersController' for clarity
  let controller: UsersController;
  let service: UsersService;

  const mockUserRepository: Partial<IUserRepository> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create-user', () => {
    it('should create a new user and return the full user object', async () => {
      // 1. Arrange: Define the input and the expected output
      const newUser: Prisma.UserCreateInput = {
        email: 'joao.silva@example.com',
        name: 'João Silva',
        birthDate: new Date('1990-05-15'),
      };

      const expectedUser = {
        id: '68c9f653031e0264f49e7a47',
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        results: [],
      };

      // 2. Act: Mock the service to return the full user object
      jest.spyOn(service, 'createUser').mockResolvedValue(expectedUser as any);
      const result = await controller.create(newUser);

      // 3. Assert: Check the results
      expect(service.createUser).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(expectedUser);
    });
  });
});
