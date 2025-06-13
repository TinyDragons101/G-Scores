

import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './module/student/student.entity';
import { Score } from './module/score/score.entity';
import { Subject } from './module/subject/subject.entity';
import { ScoreModule } from './module/score/score.module';
import { SubjectModule } from './module/subject/subject.module';
import { StudentModule } from './module/student/student.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || ''}`,
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '3306')),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', '123'),
        database: configService.get('DB_NAME', 'mysql_database'),
        entities: [Student, Score, Subject],
        synchronize: false,
      }),
    }),
    ScoreModule,
    SubjectModule,
    StudentModule,
  ],
})
export class AppModule {}