/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { SubjectsStatisticsDto } from './dto/subjects-statistics.dto';
import { DataSource } from 'typeorm'; // Ensure this import is correct based on your project structure

@Injectable()
export class SubjectService {
  public readonly SubjectIdByGroup: Record<string, number[]> = {
    "A": [1, 4, 5],
    "B": [1, 5, 6],
    "C": [3, 7, 8],
    "D": [1, 2, 3],
  }

  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly dataSource: DataSource, // Assuming DataSource is imported from the correct path
  ) {}

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find({
      order: { id: 'ASC' },
      take: 10,
    });
  }

  async findOne(id: number): Promise<Subject | null> {
    return this.subjectRepository.findOneBy({ id });
  }

  async getScoreLevelsGroupedBySubjectId(subjectId: number): Promise<SubjectsStatisticsDto> {
    const result: any[] = await this.dataSource
      .createQueryBuilder()
      .select([
        'subject.id as subject_id',
        'subject.name as subject_name',
      ])
      .addSelect(`
        SUM(CASE WHEN score.score >= 8 THEN 1 ELSE 0 END)
      `, 'level_1')
      .addSelect(`
        SUM(CASE WHEN score.score >= 6 AND score.score < 8 THEN 1 ELSE 0 END)
      `, 'level_2')
      .addSelect(`
        SUM(CASE WHEN score.score >= 4 AND score.score < 6 THEN 1 ELSE 0 END)
      `, 'level_3')
      .addSelect(`
        SUM(CASE WHEN score.score < 4 THEN 1 ELSE 0 END)
      `, 'level_4')
      .from('score', 'score')
      .innerJoin('subject', 'subject', 'subject.id = score.subject_id')
      .where('score.subject_id = :subjectId', { subjectId })
      .groupBy('subject.id')
      .getRawMany();

    console.log('getScoreLevelsGroupedBySubjectId result:', result);

    return {
      subjectId: result[0].subject_id,
      subjectName: result[0].subject_name,
      level1: result[0].level_1,
      level2: result[0].level_2,
      level3: result[0].level_3,
      level4: result[0].level_4,
    }
  }

  async create(subject: Subject): Promise<Subject> {
    return this.subjectRepository.save(subject);
  }

  async update(id: number, subject: Subject): Promise<Subject | null> {
    await this.subjectRepository.update(id, subject);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.subjectRepository.delete(id);
  }
}