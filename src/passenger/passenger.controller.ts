import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassengerDto } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@ApiTags('Passengers')
@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}
  @Post()
  createPassenger(@Body() passenger: PassengerDto) {
    return this.passengerService.create(passenger);
  }

  @Get()
  findPassengers() {
    return this.passengerService.find();
  }

  @Get(':passengerId')
  findPassengerById(@Param('passengerId') passengerId: string) {
    return this.passengerService.findOne(passengerId);
  }

  @Put(':passengerId')
  updatePassenger(
    @Param('passengerId') passengerId: string,
    @Body() passenger: PassengerDto,
  ) {
    return this.passengerService.update(passengerId, passenger);
  }

  @Delete(':passengerId')
  deletePassenger(@Param('passengerId') passengerId: string) {
    return this.passengerService.delete(passengerId);
  }
}
