import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import { EventsModule } from './events/events.module';
import { MatchesModule } from './matches/matches.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { EmailModule } from './email/email.module';
import { User } from './users/user.entity';
import { Sport } from './sports/sport.entity';
import { Event } from './events/event.entity';
import { Match } from './matches/match.entity';
import { Classification } from './classifications/classification.entity';
import { News } from './news/news.entity';
import { PasswordResetToken } from './auth/entities/password-reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'miki_user',
      password: '7667',
      database: 'zonesport_db',
      entities: [User, Sport, Event, Match, Classification, News, PasswordResetToken],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    SportsModule,
    EventsModule,
    MatchesModule,
    ClassificationsModule,
    NewsModule,
    EmailModule,
  ],
})
export class AppModule { }
