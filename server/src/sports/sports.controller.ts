import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dtos/create-sport.dto';

@Controller('sports')
export class SportsController {
    constructor(private readonly sportsService: SportsService) { }

    @Post()
    create(@Body() createSportDto: CreateSportDto) {
        return this.sportsService.create(createSportDto);
    }

    @Get()
    findAll() {
        return this.sportsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sportsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() createSportDto: CreateSportDto) {
        return this.sportsService.update(+id, createSportDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sportsService.remove(+id);
    }
}
