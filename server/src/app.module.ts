import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Sport, Event, Match, Classification, News, PasswordResetToken],
      synchronize: true,
      autoLoadEntities: true,
      logging: process.env.NODE_ENV === 'development',
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
