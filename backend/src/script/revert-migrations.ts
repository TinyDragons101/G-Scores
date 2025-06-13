import AppDataSource from '../database/data-source';

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
    await AppDataSource.undoLastMigration();
    console.log('Last migration has been reverted!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });