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
import { PassengerDto } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@ApiTags('Passengers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
