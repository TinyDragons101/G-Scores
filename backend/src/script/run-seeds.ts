import { runSeeders } from 'typeorm-extension';
import AppDataSource from '../database/data-source';

AppDataSource.initialize()
  .then(async () => {
    await runSeeders(AppDataSource);
    console.log(' Seeding completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(' Error running seeders:', err);
    process.exit(1);
  });