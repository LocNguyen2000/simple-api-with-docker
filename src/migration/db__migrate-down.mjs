import sequelize from '../config/database.mjs';
import migration from './index.mjs';

try {
  await migration.down(sequelize);
} catch (error) {
  console.log(error);
} finally {
  process.exit(0);
}
