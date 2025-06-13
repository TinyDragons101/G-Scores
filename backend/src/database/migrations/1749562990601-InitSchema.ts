import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749562990601 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE student (
                id VARCHAR(10) PRIMARY KEY,
                language_code VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
        );

        await queryRunner.query(`
            CREATE TABLE subject (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(10) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
        );

        await queryRunner.query(`
            CREATE TABLE score (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(10) NOT NULL,
                subject_id INT NOT NULL,
                score DECIMAL(4, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subject (id) ON DELETE CASCADE
            );`
        );

        // Must turn on multiple statements for the next query
        // await queryRunner.query(`
        //     CREATE INDEX idx_student_id ON score (student_id);
        //     CREATE INDEX idx_subject_score ON score (subject_id, score);
        //     CREATE INDEX idx_score_student_subject ON score (student_id, subject_id);
        // `);

        await queryRunner.query(`
            CREATE INDEX idx_student_id ON score (student_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_subject_score ON score (subject_id, score);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_score_student_subject ON score (student_id, subject_id);
        `);

        // Enable local infile for loading data from CSV files
        // await queryRunner.query(`
        //     SET GLOBAL local_infile = 1;
        // `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE score`);
        await queryRunner.query(`DROP TABLE subject`);
        await queryRunner.query(`DROP TABLE student`);
    }
}
