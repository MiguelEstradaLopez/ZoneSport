import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dtos/create-match.dto';
import { RecordResultDto } from './dtos/record-result.dto';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) { }

    @Post()
    create(@Body() createMatchDto: CreateMatchDto) {
        return this.matchesService.create(createMatchDto);
    }

    @Get()
    findAll() {
        return this.matchesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.matchesService.findOne(id);
    }

    @Get('event/:eventId')
    findByTournament(@Param('eventId') eventId: string) {
        return this.matchesService.findByTournament(eventId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() createMatchDto: CreateMatchDto) {
        return this.matchesService.update(id, createMatchDto);
    }

    @Post(':id/result')
    recordResult(@Param('id') id: string, @Body() recordResultDto: RecordResultDto) {
        return this.matchesService.recordResult(id, recordResultDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.matchesService.remove(id);
    }
}
