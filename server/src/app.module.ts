import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import { EventsModule } from './events/events.module';
import { MatchesModule } from './matches/matches.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { NewsModule } from './news/news.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
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
