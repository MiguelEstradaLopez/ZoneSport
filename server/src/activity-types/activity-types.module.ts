import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityType } from './activity-type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityType])],
    exports: [TypeOrmModule],
})
export class ActivityTypesModule { }
