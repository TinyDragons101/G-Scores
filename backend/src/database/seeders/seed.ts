/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
import AppDataSource from '../data-source';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Student } from 'src/module/student/student.entity';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { Subject } from 'src/module/subject/subject.entity';
import { Score } from 'src/module/score/score.entity';

const inputCsvPath = path.join(__dirname, '../../../res/diem_thi_thpt_2024.csv');
const scoreCsvPath = path.join(__dirname, '../../../res/score.csv');

export class SeedData implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    console.log('Starting seeding process...');
    const studentRepository = AppDataSource.getRepository(Student);
    const subjectRepository = AppDataSource.getRepository(Subject);
    const scoreRepository = AppDataSource.getRepository(Score);

    const subjectNameToIdMap: { [key: string]: number } = {};

    // Check if seeder has been run before
    const existingSubjects = await subjectRepository.find();
    if (existingSubjects.length > 0) {
      console.log("Seeder has already been run. Skipping subject seeding.");
      return;
    }

    // Seed subjects
    console.log('Seeding subjects...');
    const subjects: Subject[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(inputCsvPath)
        .pipe(csvParser())
        .on('headers', (headers: string[]) => {
          console.log('CSV Headers:', headers);

          // The first column is 'sbd' and the next 9 columns are subjects
          for (let i = 1; i <= 9; i++) {
            const subject = new Subject();
            subject.name = headers[i];
            subjects.push(subject);
          }
        })
        .on('data', () => {
          // Do nothing
        })
        .on('end', async () => {
          console.log('CSV file successfully processed for subjects.');

          // Save subjects to db
          const savedSubjects = await subjectRepository.save(subjects);
          savedSubjects.forEach((subject, index) => {
            subjectNameToIdMap[subject.name] = subject.id;
          });

          console.log('Subjects saved successfully.');
          resolve();
        })
        .on('error', (error: Error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });

    // Generate score.csv
    console.log('🛠️  Generating score.csv...');
    await this.generateScoreCsv(subjectNameToIdMap);
    console.log('✅ score.csv generated.');

    // Seed students
    console.log('Seeding students and scores...');

    const pool = (dataSource.driver as any).pool;

    await new Promise<void>((resolve, reject) => {
      pool.getConnection((err: any, connection: any) => {
        if (err) return reject(err);

        connection.query({
          sql: `
            LOAD DATA LOCAL INFILE ?
            INTO TABLE student
            FIELDS TERMINATED BY ','
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES
            (@sbd, @toan, @ngu_van, @ngoai_ngu, @vat_li, @hoa_hoc, @sinh_hoc, @lich_su, @dia_li, @gdcd, @ma_ngoai_ngu)
            SET id = @sbd, language_code = NULLIF(@ma_ngoai_ngu, '');
          `,
          infileStreamFactory: () => fs.createReadStream(inputCsvPath),
          values: [inputCsvPath],
        }, (error: any) => {
          connection.release();
          if (error) return reject(error);
          console.log('LOAD DATA INFILE for students completed.');
          resolve();
        });
      });
    });

    // Load scores from score.csv
    await new Promise<void>((resolve, reject) => {
      pool.getConnection((err: any, connection: any) => {
        if (err) return reject(err);
        connection.query({
          sql: `
            LOAD DATA LOCAL INFILE ?
            INTO TABLE score
            FIELDS TERMINATED BY ','
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES
            (@student_id, @subject_id, @score)
            SET student_id = @student_id,
                subject_id = @subject_id,
                score = @score;
          `,
          infileStreamFactory: () => fs.createReadStream(scoreCsvPath),
          values: [scoreCsvPath],
        }, (error: any) => {
          connection.release();
          if (error) return reject(error);
          console.log('LOAD DATA INFILE for scores completed.');
          resolve();
        });
      });
    });
    console.log('Students and scores seeded successfully.');



    // await dataSource.query(`
    //   LOAD DATA LOCAL INFILE '${inputCsvPath}'
    //   INTO TABLE student
    //   FIELDS TERMINATED BY ','
    //   ENCLOSED BY '"'
    //   LINES TERMINATED BY '\n'
    //   IGNORE 1 LINES
    //   (@sbd, @toan, @ngu_van, @ngoai_ngu, @vat_li, @hoa_hoc, @sinh_hoc, @lich_su, @dia_li, @gdcd, @ma_ngoai_ngu)
    //   SET id = @sbd, language_code = NULLIF(@ma_ngoai_ngu, '');
    //   `)

    // await dataSource.query(`
    //   LOAD DATA LOCAL INFILE '${scoreCsvPath}'
    //   INTO TABLE score
    //   FIELDS TERMINATED BY ','
    //   ENCLOSED BY '"'
    //   LINES TERMINATED BY '\n'
    //   IGNORE 1 LINES
    //   (student_id, subject_id, score)
    //   SET student_id = @student_id,
    //       subject_id = @subject_id,
    //       score = @score;
    // `)
    // console.log('✅ Students and scores seeded successfully.');

  };


  private async generateScoreCsv(subjectNameToIdMap: Record<string, number>): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(scoreCsvPath);
      output.write('student_id,subject_id,score\n'); // Ghi header thủ công

      fs.createReadStream(inputCsvPath)
        .pipe(csvParser())
        .on('data', (row: { [key: string]: string }) => {
          const studentId = row['sbd'];

          Object.keys(subjectNameToIdMap).forEach((subjectName) => {
            const scoreStr = row[subjectName];
            const score = parseFloat(scoreStr);
            if (scoreStr?.trim() !== '' && !isNaN(score)) {
              const subjectId = subjectNameToIdMap[subjectName];
              const line = `${studentId},${subjectId},${score.toFixed(2)}\n`;
              output.write(line);
            }
          });
        })
        .on('end', () => {
          output.end();
          resolve();
        })
        .on('error', (err) => {
          output.end();
          reject(err);
        });
    });
  }
}