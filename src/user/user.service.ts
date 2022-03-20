import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { USER } from 'src/common/models/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { runInThisContext } from 'vm';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(user: UserDto): Promise<IUser> {
    const hash = await this.hashPassword(user.password);
    const newUser = new this.model({ ...user, password: hash });
    return await newUser.save();
  }

  async find(): Promise<IUser[]> {
    return await this.model.find();
  }

  async findOne(userId: string): Promise<IUser> {
    return await this.model.findById(userId);
  }

  async findByUserName(username: string): Promise<IUser> {
    return await this.model.findOne({ username });
  }

  async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  async update(userId: string, user: UserDto): Promise<IUser> {
    const hash = await this.hashPassword(user.password);
    const updatedUser = { ...user, password: hash };
    return await this.model.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });
  }

  async delete(userId: string) {
    await this.model.findByIdAndDelete(userId);
    return { status: HttpStatus.OK, message: `Usuario eliminado` };
  }
}
