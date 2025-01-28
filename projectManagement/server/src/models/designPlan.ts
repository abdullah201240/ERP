import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the DesignPlan model
interface DesignPlanAttributes {
  id: number;
  projectId: string;
  assignee: string;
  stepName: string;
  stepType: string;
  startDate : string;
  endDate: string;
  remarks?: string;
 
}

interface DesignPlanCreationAttributes extends Optional<DesignPlanAttributes, 'id'> {}

// Define the DesignPlan model class
class DesignPlan extends Model<DesignPlanAttributes, DesignPlanCreationAttributes> implements DesignPlanAttributes {
  public id!: number;
  public projectId!: string;
  public assignee!: string;
  public stepName!: string;
  public stepType!: string;
  public startDate!: string;
  public endDate!: string;
  public remarks?: string;
  
}

DesignPlan.init(
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
    assignee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stepType: {
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
    
    

  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'DesignPlan',
    tableName: 'designPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default DesignPlan;
