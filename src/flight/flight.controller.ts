import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassengerService } from 'src/passenger/passenger.service';
import { FlightDto } from './dto/flight.dto';
import { FlightService } from './flight.service';

@ApiTags('Flights')
@Controller('flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}
  @Post()
  createFlight(@Body() flight: FlightDto) {
    return this.flightService.create(flight);
  }

  @Get()
  findFlights() {
    return this.flightService.find();
  }

  @Get(':flightId')
  findFlightById(@Param('flightId') flightId: string) {
    return this.flightService.findOne(flightId);
  }

  @Put(':flightId')
  updateFlight(@Param('flightId') flightId: string, @Body() flight: FlightDto) {
    return this.flightService.update(flightId, flight);
  }

  @Delete(':flightId')
  deleteFlight(@Param('flightId') flightId: string) {
    return this.flightService.delete(flightId);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this.passengerService.findOne(passengerId);
    if (!passenger) {
      throw new HttpException('Pasajero no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.flightService.addPassenger(flightId, passengerId);
  }
}
