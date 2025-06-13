import { SubjectScoreDto } from './subject-score.dto';

export interface StudentScoreDto {
  studentId: string;
  languageCode: string | null;
  scoreList: SubjectScoreDto[];
}