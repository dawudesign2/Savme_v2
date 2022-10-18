import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './service/users.service';
import { AuthService } from './service/auth.service';
import { UsersController } from './controller/users.controller';
import { User } from './entity/users.entity';
import { CurrentUserInterceptor } from './interceptor/currentUser.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
