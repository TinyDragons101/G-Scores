import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('score')
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', unique: true })
  studentId: string;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @Column({ name: 'score' })
  score: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
