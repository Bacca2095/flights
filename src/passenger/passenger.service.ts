import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { PASSENGER } from 'src/common/models/models';
import { Model } from 'mongoose';
import { PassengerDto } from './dto/passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) {}
  async create(passenger: PassengerDto): Promise<IPassenger> {
    const newPassenger = new this.model({ ...passenger });
    return await newPassenger.save();
  }

  async find(): Promise<IPassenger[]> {
    return await this.model.find();
  }

  async findOne(passengerId: string): Promise<IPassenger> {
    return await this.model.findById(passengerId);
  }

  async update(
    passengerId: string,
    passenger: PassengerDto,
  ): Promise<IPassenger> {
    const updatedPassenger = { ...passenger };
    return await this.model.findByIdAndUpdate(passengerId, updatedPassenger, {
      new: true,
    });
  }

  async delete(passengerId: string) {
    await this.model.findByIdAndDelete(passengerId);
    return { status: HttpStatus.OK, message: `Usuario eliminado` };
  }
}
