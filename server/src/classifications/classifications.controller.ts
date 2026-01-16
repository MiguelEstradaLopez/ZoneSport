import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';

@Controller('classifications')
export class ClassificationsController {
    constructor(private readonly classificationsService: ClassificationsService) { }

    @Get('event/:eventId')
    findByEvent(@Param('eventId') eventId: string) {
        return this.classificationsService.findByEvent(+eventId);
    }

    @Post('event/:eventId/team')
    create(
        @Param('eventId') eventId: string,
        @Body() body: { teamName: string },
    ) {
        return this.classificationsService.create(+eventId, body.teamName);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.classificationsService.remove(+id);
    }
}
