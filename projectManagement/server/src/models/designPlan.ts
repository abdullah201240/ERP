// Updated DesignPlan Model

import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';

interface DesignPlanAttributes {
  id: number;
  projectId: string;
  assignee: string;
  stepName: string;
  stepType: string;
  startDate: string;
  endDate: string;
  remarks?: string;
  completed?: string;  // Change this to a string
}

interface DesignPlanCreationAttributes extends Optional<DesignPlanAttributes, 'id'> {}

class DesignPlan extends Model<DesignPlanAttributes, DesignPlanCreationAttributes> implements DesignPlanAttributes {
  public id!: number;
  public projectId!: string;
  public assignee!: string;
  public stepName!: string;
  public stepType!: string;
  public startDate!: string;
  public endDate!: string;
  public remarks?: string;
  public completed?: string;  // Change this to a string
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
    completed: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',  // Default value is the string '0'
    },
  },
  {
    sequelize: db,
    modelName: 'DesignPlan',
    tableName: 'designPlans',
    timestamps: true,
  }
);

export default DesignPlan;
