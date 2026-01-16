import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
        return this.eventsService.create({ ...createEventDto, organizerId: user.id });
    }

    @Get()
    findAll() {
        return this.eventsService.findAll();
    }

    @Get(':id/classification')
    getClassification(@Param('id') id: string) {
        return this.eventsService.findOne(+id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
        return this.eventsService.update(+id, createEventDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.eventsService.remove(+id, user);
    }
}
