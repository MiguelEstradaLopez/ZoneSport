
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityType } from './activity-type.entity';
import { ActivityTypesController } from './activity-types.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityType])],
    controllers: [ActivityTypesController],
    exports: [TypeOrmModule],
})
export class ActivityTypesModule { }
