import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentScoreDto } from '../score/dto/student-score.dto';
import { ScoreService } from '../score/score.service';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    // private readonly scoreService: ScoreService,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      order: { id: 'ASC' },
      take: 10,
    });
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOneBy({ id });
  }

  async create(student: Student): Promise<Student> {
    return this.studentRepository.save(student);
  }

  async update(id: string, student: Student): Promise<Student | null> {
    await this.studentRepository.update(id, student);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.studentRepository.delete(id);
  }
}