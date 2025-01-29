import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the DegineBOQ model
interface DegineBOQAttributes {
  id: number;
  projectName: string;
  clientName: string;
  clientContact: string;
  projectAddress: string;
  totalArea: number;
  inputPerSftFees: number;
  totalFees: number;
  termsCondition: string;
  signName: string;
  designation: string;
  projectId: string;  // New field
}

interface DegineBOQCreationAttributes extends Optional<DegineBOQAttributes, 'id'> {}

class DegineBOQ extends Model<DegineBOQAttributes, DegineBOQCreationAttributes> implements DegineBOQAttributes {
  public id!: number;
  public projectName!: string;
  public clientName!: string;
  public clientContact!: string;
  public projectAddress!: string;
  public totalArea!: number;
  public inputPerSftFees!: number;
  public totalFees!: number;
  public termsCondition!: string;
  public signName!: string;
  public designation!: string;
  public projectId!: string;  // New field
}

DegineBOQ.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalArea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inputPerSftFees: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalFees: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    termsCondition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    signName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectId: {  // New field
      type: DataTypes.STRING,
      allowNull: true, // Can be null initially
    },
  },
  {
    sequelize: db,
    modelName: 'DegineBOQ',
    tableName: 'degine_boqs',
    timestamps: true,
  }
);

export default DegineBOQ;
