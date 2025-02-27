import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the ProductionWorkPlan model
interface ProductionWorkPlanAttributes {
  id: number;
  projectId: string; // New field
  workingDrawingsId: string;
  assignee: string;
  workType: string;
  startDate: string;
  endDate: string;
  remarks?: string;
  completed?: string;
  status?: string; // New field with default value
  handOverAccounts?: number; // New optional field with default value
}

interface ProductionWorkPlanCreationAttributes extends Optional<ProductionWorkPlanAttributes, 'id'> {}

// Define the ProductionWorkPlan model class
class ProductionWorkPlan extends Model<ProductionWorkPlanAttributes, ProductionWorkPlanCreationAttributes> implements ProductionWorkPlanAttributes {
  public id!: number;
  public projectId!: string; // New field
  public workingDrawingsId!: string;
  public assignee!: string;
  public workType!: string;
  public startDate!: string;
  public endDate!: string;
  public remarks?: string;
  public completed?: string;
  public status?: string; // New field
  public handOverAccounts?: number; // New optional field
}

ProductionWorkPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workingDrawingsId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assignee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yet to Start", // Default value added
    },
    handOverAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // Default value added
    },
  },
  {
    sequelize: db,
    modelName: 'ProductionWorkPlan',
    tableName: 'productionWorkPlans',
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default ProductionWorkPlan;
