import { forwardRef, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '@nestjs/common';
import { Subject } from './subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { ScoreModule } from '../score/score.module';
import { ScoreService } from '../score/score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject]),
    forwardRef(() => ScoreModule)
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}