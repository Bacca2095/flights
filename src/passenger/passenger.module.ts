import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PASSENGER } from 'src/common/models/models';
import { PassengerSchema } from './schema/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: PASSENGER.name, useFactory: () => PassengerSchema },
    ]),
  ],
  providers: [PassengerService],
  controllers: [PassengerController],
  exports: [PassengerService],
})
export class PassengerModule {}
