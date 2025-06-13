import { Controller, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { ScoreService } from '../score/score.service';

@Controller('students')
@Injectable()
export class StudentController {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly studentService: StudentService,
    private readonly scoreService: ScoreService, 
  ) {}

  @Get('test')
  test(): string {
    return 'test';
  }

  @Get('/:studentId/scores')
  async getScoresByStudentId(@Param('studentId') studentId: string) {
    console.log('Controller getScoresByStudentId called with studentId:', studentId);
    return this.scoreService.getScoreByStudentId(studentId);
  }

  // GET /api/students/top?group=A&limit=10
  @Get('/top')
  async getTopStudentsByGroup(@Query('group') group: string, @Query('limit') limit: number) {
    console.log('Controller getTopStudentsByGroup called with group:', group, 'and limit:', limit);
    return this.scoreService.getTopStudentsByGroup(group, limit);
  }
}
  