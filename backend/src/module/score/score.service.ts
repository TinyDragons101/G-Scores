/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Score } from "./score.entity";
import { StudentService } from "../student/student.service";
import { StudentScoreDto } from "./dto/student-score.dto";
import { SubjectScoreDto } from "./dto/subject-score.dto";
import { SubjectsStatisticsDto } from "../subject/dto/subjects-statistics.dto";
import { SubjectService } from "../subject/subject.service";

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly studentService: StudentService,
    private readonly dataSource: DataSource,
    private readonly subjectService: SubjectService,
  ) {}

  async findAll(): Promise<Score[]> {
    return this.scoreRepository.find(
      {
        order: { studentId: "ASC", subjectId: "ASC" },
        take: 10
      }
    );
  }

  async getScoreByStudentId(studentId: string): Promise<StudentScoreDto> {
    const studentDetails = await this.studentService.findOne(studentId);

    if (!studentDetails) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    const scoreList: any[] = await this.dataSource
      .createQueryBuilder()
      .select([
        'subject.id AS subject_id',
        'score.score AS score'
      ])
      .from('score', 'score')
      .innerJoin('subject', 'subject', 'subject.id = score.subject_id')
      .where('score.student_id = :studentId', { studentId })
      .getRawMany();

      return {
        studentId: studentDetails.id,
        languageCode: studentDetails.languageCode,
        scoreList: scoreList.map(item => ({
          subjectId: item.subject_id,
          score: item.score
        }))
      };
  }

  async getTopStudentsByGroup(group: string, top: number): Promise<StudentScoreDto[]> {
    console.log(`getTopStudentsByGroup called with group: ${group}, top: ${top}`);

    const subjectIds: number[] = this.subjectService.SubjectIdByGroup[group];
    const subject1Id = subjectIds[0];
    const subject2Id = subjectIds[1];
    const subject3Id = subjectIds[2];

    console.log(`getTopStudentsByGroup called with group: ${group}, top: ${top}`);
    console.log(`Subject IDs: ${subject1Id}, ${subject2Id}, ${subject3Id}`);

    const result: any[] = await this.dataSource
      .createQueryBuilder()
      .select([
        'student.id as student_id',
        'student.language_code as language_code',
        'sum(case when score.subject_id = :subject1Id then score.score else 0 end) as subject_1_score',
        'sum(case when score.subject_id = :subject2Id then score.score else 0 end) as subject_2_score',
        'sum(case when score.subject_id = :subject3Id then score.score else 0 end) as subject_3_score',
        'SUM(score.score) as total_score',
      ])
      .from('score', 'score')
      .innerJoin('student', 'student', 'student.id = score.student_id')
      .where('score.subject_id in (:subject1Id, :subject2Id, :subject3Id)', { subject1Id, subject2Id, subject3Id })
      .groupBy('student.id')
      .orderBy('total_score', 'DESC')
      .limit(top)
      .getRawMany();

    console.log('getTopStudentsByGroup result:', result);
      
    return result.map(item => ({
      studentId: item.student_id,
      languageCode: item.language_code,
      scoreList: [
        { subjectId: subject1Id, score: item.subject_1_score },
        { subjectId: subject2Id, score: item.subject_2_score },
        { subjectId: subject3Id, score: item.subject_3_score },
      ]
    }));
  }

  async findOne(id: number): Promise<Score | null> {
    return this.scoreRepository.findOneBy({ id });
  }

  async create(score: Score): Promise<Score> {
    return this.scoreRepository.save(score);
  }

  async update(id: number, score: Score): Promise<Score | null> {
    await this.scoreRepository.update(id, score);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.scoreRepository.delete(id);
  }
}