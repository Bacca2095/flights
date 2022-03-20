import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/common/interfaces/user.interface';
import { EnvVariables } from 'src/config/env/env-variables.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}
  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    const user = await this.userService.findByUserName(username);

    if (!user) {
      return null;
    }
    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (isValidPassword) {
      return user;
    }
  }

  async signIn(user: any) {
    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: UserDto) {
    return this.userService.create(user);
  }
}
