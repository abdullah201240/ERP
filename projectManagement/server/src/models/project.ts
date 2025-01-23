import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Project model
interface ProjectAttributes {
  id: number;
  projectType: string;
  projectName: string;
  totalArea: string;
  projectAddress: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  clientEmail: string;
  creatorName: string;
  creatorEmail: string;
  requirementDetails: string;
  supervisorName?: string; // Optional
  supervisorEmail?: string; // Optional
  startDate?: string; // Optional
  endDate?: string; // Optional
  projectDeadline?: string;
  estimatedBudget?: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

// Define the Project model class
class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public projectType!: string;
  public projectName!: string;
  public totalArea!: string;
  public projectAddress!: string;
  public clientName!: string;
  public clientAddress!: string;
  public clientContact!: string;
  public clientEmail!: string;
  public creatorName!: string;
  public creatorEmail!: string;
  public requirementDetails!: string;
  public supervisorName?: string; // Optional
  public supervisorEmail?: string; // Optional
  public startDate?: string; // Optional
  public endDate?: string; // Optional
  public projectDeadline?: string;
  public estimatedBudget?: string;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    projectType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirementDetails: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    supervisorName: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    supervisorEmail: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    projectDeadline:{
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    estimatedBudget:{
      type: DataTypes.STRING,
      allowNull: true, // Optional
    }

  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'Project',
    tableName: 'projects', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default Project;
