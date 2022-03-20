import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.create(user);
  }

  @Get()
  findUsers() {
    return this.userService.find();
  }

  @Get(':userId')
  findUserById(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Put(':userId')
  updateUser(@Param('userId') userId: string, @Body() user: UserDto) {
    return this.userService.update(userId, user);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.delete(userId);
  }
}
