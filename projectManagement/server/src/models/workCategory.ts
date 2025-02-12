import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface WorkCategoryAttributes {
  id: number;
  name: string;
  sisterConcernId: number | null;  // Add sisterConcernId here
}

interface WorkCategoryCreationAttributes extends Optional<WorkCategoryAttributes, 'id'> {}

class WorkCategory extends Model<WorkCategoryAttributes, WorkCategoryCreationAttributes> implements WorkCategoryAttributes {
  public id!: number;
  public name!: string;
  public sisterConcernId!: number | null;  // Add sisterConcernId here
}

WorkCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sisterConcernId: {  // Define the new column
      type: DataTypes.INTEGER,
      allowNull: true,  // Allow null if it isn't mandatory
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'WorkCategory',
    tableName: 'workCategorys', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default WorkCategory;
