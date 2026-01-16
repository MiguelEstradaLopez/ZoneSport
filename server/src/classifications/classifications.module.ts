import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classification } from './classification.entity';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Classification])],
    controllers: [ClassificationsController],
    providers: [ClassificationsService],
    exports: [ClassificationsService],
})
export class ClassificationsModule { }
