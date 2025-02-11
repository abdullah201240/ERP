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
  projectId: string;
  sisterConcernId: number;  // New field
  subject?: string;
  firstPera?: string;
  secondPera?: string;
  feesProposal?: string;
  feesProposalNote1?: string;
  feesProposalNote2?: string;
  date?: string;
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
  public projectId!: string;
  public sisterConcernId!: number; // New field
  public subject?: string;
  public firstPera?: string;
  public secondPera?: string;
  public feesProposal?: string;
  public feesProposalNote1?: string;
  public feesProposalNote2?: string;
  public date?: string;
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
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sisterConcernId: { // New field
      type: DataTypes.INTEGER,
      allowNull: false,  // Assuming every record must belong to a sister concern
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstPera: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    secondPera: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feesProposal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feesProposalNote1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feesProposalNote2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
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
