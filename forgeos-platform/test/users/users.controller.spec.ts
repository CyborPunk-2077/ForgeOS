import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [{ id: 1, username: 'testuser', email: 'test@example.com' }];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = { id: 1, username: 'testuser', email: 'test@example.com' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      
      const result = { id: 1, ...userData };
      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      expect(await controller.create(userData)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };
      
      const result = { id: 1, ...userData };
      jest.spyOn(usersService, 'update').mockResolvedValue(result);

      expect(await controller.update(1, userData)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });
});