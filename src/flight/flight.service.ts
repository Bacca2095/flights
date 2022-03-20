import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { FLIGHT } from 'src/common/models/models';
import { Model } from 'mongoose';
import { FlightDto } from './dto/flight.dto';
import axios from 'axios';
import * as moment from 'moment';
import { ILocation } from 'src/common/interfaces/location.interface';
import { IWeather } from 'src/common/interfaces/weather.interface';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}
  async create(flight: FlightDto): Promise<IFlight> {
    const newFlight = new this.model({ ...flight });
    return await newFlight.save();
  }

  async find(): Promise<IFlight[]> {
    return await this.model.find().populate('passengers');
  }

  async findOne(flightId: string): Promise<IFlight> {
    const flight = await this.model.findById(flightId).populate('passengers');
    const location: ILocation = await this.getLocation(flight.destination);
    const weather: IWeather[] = await this.getWeather(
      location.woeid,
      flight.flightDate,
    );

    return this.assignProp(flight, weather);
  }

  async update(flightId: string, flight: FlightDto): Promise<IFlight> {
    const updatedFlight = { ...flight };
    return await this.model.findByIdAndUpdate(flightId, updatedFlight, {
      new: true,
    });
  }

  async delete(flightId: string) {
    await this.model.findByIdAndDelete(flightId);
    return { status: HttpStatus.OK, message: `Usuario eliminado` };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId },
        },
        { new: true },
      )
      .populate('passengers');
  }

  async getLocation(location: string): Promise<ILocation> {
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/search/?query=${location}`,
    );
    return data[0];
  }

  async getWeather(woeId: number, flightDate: Date): Promise<IWeather[]> {
    const date = moment.utc(flightDate).format('YYYY/MM/DD');

    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/${woeId}/${date}`,
    );

    return data;
  }

  assignProp(
    { _id, pilot, airplane, destination, flightDate, passengers }: IFlight,
    weather: IWeather[],
  ): IFlight {
    return Object.assign({
      _id,
      pilot,
      airplane,
      destination,
      flightDate,
      passengers,
      weather,
    });
  }
}
