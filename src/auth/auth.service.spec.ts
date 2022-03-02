import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import e = require('express');
import { Testing } from '../../pkg/tesing';
import { AuthService, AuthServiceExceptions } from './auth.service';
import { BaseUser, User, Admin } from './entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          AuthService,
          {
              provide: getRepositoryToken(BaseUser),
              useValue: {
                  find: jest.fn().mockResolvedValue([])
              }
          }
        ],
      imports: [
          Testing.testDatabase(),
          TypeOrmModule.forFeature([BaseUser, User, Admin])
        ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//   describe("createUser", () => {
//       it('should create user', async () => {
//           const created = await service.createUser({phoneNumber: "83221371345", name: "Some Name"})
//           console.log(created)
//       })
//   })

//   describe('Exeptions', () => {
//         describe("should be instanse of UserNotFound", () => {
//             try {
//                 throw AuthServiceExceptions.UserExist
//             } catch(err) {
//                 console.log(err)
//                 expect(err).toBeInstanceOf(AuthServiceExceptions.UserExist)
//             }
//         })
//   })
});
