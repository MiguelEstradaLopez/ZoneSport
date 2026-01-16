import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        const event = this.eventsRepository.create({
            ...createEventDto,
            startDate: new Date(createEventDto.startDate),
            endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : null,
        });
        return this.eventsRepository.save(event);
    }

    async findAll(): Promise<Event[]> {
        return this.eventsRepository.find({
            relations: ['sport', 'organizer', 'matches', 'classifications'],
        });
    }

    async findOne(id: number): Promise<Event> {
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: ['sport', 'organizer', 'matches', 'classifications'],
        });
        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }
        return event;
    }

    async update(id: number, createEventDto: CreateEventDto, user: User): Promise<Event> {
        const event = await this.findOne(id);

        // Verificar que el usuario es el organizador
        if (event.organizerId !== user.id) {
            throw new ForbiddenException('Solo el organizador puede editar este evento');
        }

        Object.assign(event, {
            ...createEventDto,
            startDate: new Date(createEventDto.startDate),
            endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : null,
        });
        return this.eventsRepository.save(event);
    }

    async remove(id: number, user: User): Promise<void> {
        const event = await this.findOne(id);

        // Verificar que el usuario es el organizador
        if (event.organizerId !== user.id) {
            throw new ForbiddenException('Solo el organizador puede eliminar este evento');
        }

        await this.eventsRepository.remove(event);
    }

    async updateStatus(id: number, status: EventStatus): Promise<Event> {
        const event = await this.findOne(id);
        event.status = status;
        return this.eventsRepository.save(event);
    }
}
