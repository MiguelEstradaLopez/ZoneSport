import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityType } from './activity-type.entity';

@Controller('activity-types')
export class ActivityTypesController {
    constructor(
        @InjectRepository(ActivityType)
        private readonly activityTypeRepo: Repository<ActivityType>,
    ) { }

    @Get()
    async findAll() {
        return this.activityTypeRepo.find();
    }
}
