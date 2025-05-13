
import { sequelize } from './models/index.js';

const syncDatabase = async () => {
  try {
    // await sequelize.sync({ force: false, alter: true }); // `force: true` drops all tables and creates new ones
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // await sequelize.sync({ alter: true }); // `alter: true` updates tables safely
    console.log('All tables synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// syncDatabase();
export default syncDatabase