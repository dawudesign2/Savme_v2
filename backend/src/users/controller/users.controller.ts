import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UsersService } from './../service/users.service';
import { AuthService } from '../service/auth.service';
import { CurrentUser } from '../decorator/currentUser.decorator';
import { User } from '../entity/users.entity';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/profile')
  profile(@CurrentUser() user: User) {
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAlUsers() {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id, 10));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
    return { message: 'Successfully signed out' };
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const { password } = body;
    if (password) {
      const user = await this.authService.updatePassword(parseInt(id, 10), {
        password,
      });
      return user;
    }
    return this.usersService.update(parseInt(id, 10), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }
}
