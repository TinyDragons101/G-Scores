import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';
import { Get, Controller } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('subjects')
export class SubjectController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly subjectService: SubjectService,
  ) {}

  @Get('test')
  test(): string {
    return 'test';
  }

  @Get()
  async getAllSubjects() {
    console.log('Controller getAllSubjects called');
    return this.subjectService.findAll();
  }

  @Get('/:subjectId/statistics')
  async getStatisticsBySubjectId(@Param('subjectId') subjectId: number) {
    console.log('Controller getStatisticsBySubjectId called with subjectId:', subjectId);
    return this.subjectService.getScoreLevelsGroupedBySubjectId(subjectId);
  }
}