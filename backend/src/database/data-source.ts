import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = path.resolve(process.cwd(), `.env${process.env.NODE_ENV == 'production' ? '.production' : ''}`);
dotenv.config({ path: envPath });

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { Student } from 'src/module/student/student.entity';
import { Score } from 'src/module/score/score.entity';
import { Subject } from 'src/module/subject/subject.entity';
import { ConfigService } from '@nestjs/config';

const options = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Student, Subject, Score],
  migrations: [__dirname + '/migrations/*.ts'],
  seeds: [__dirname + '/seeders/*.ts'],
  synchronize: false,
  extra: {
    localInfile: true,
  },
  multipleStatements: true,
} as SeederOptions;

const AppDataSource = new DataSource(options as DataSourceOptions);
export default AppDataSource;