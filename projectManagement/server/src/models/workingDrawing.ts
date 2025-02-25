import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed
import DesignMaterialList from './designMaterialList';

// Interface for attributes
interface WorkingDrawingAttributes {
  id: number;
  projectId: string;
  itemName: string;
  brandModel?: string;
  itemQuantity: string;
  itemDescription: string;
  unit: string;
  category: string;
  clientName: string;
  clientContact: string;
  projectAddress: string;
  projectName: string; 
  sisterConcernId?: string; 
  status?: string;
  handOverAccounts?: number;
  materialHandOver?: number;
  operatingExpense?: string;
  vat?: string;
  tax?: string;
  margin?: string; // New field for margin
}

// Interface for creating new WorkingDrawing (excluding id as it's auto-generated)
interface WorkingDrawingCreationAttributes extends Optional<WorkingDrawingAttributes, 'id'> {}

class WorkingDrawing extends Model<WorkingDrawingAttributes, WorkingDrawingCreationAttributes> implements WorkingDrawingAttributes {
  public id!: number;
  public projectId!: string;
  public itemName!: string;
  public brandModel?: string;
  public itemQuantity!: string;
  public itemDescription!: string;
  public unit!: string;
  public category!: string;
  public clientName!: string;
  public clientContact!: string;
  public projectAddress!: string;
  public projectName!: string;
  public sisterConcernId?: string;
  public status?: string;
  public materialList?: DesignMaterialList[];

  public handOverAccounts?: number;
  public materialHandOver?: number;
  public operatingExpense?: string;
  public vat?: string;
  public tax?: string;
  public margin?: string; // New field for margin
}

WorkingDrawing.init(
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
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemQuantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
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
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sisterConcernId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending',
    },
    handOverAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    materialHandOver: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    operatingExpense: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    margin: {
      type: DataTypes.STRING, // Adjust type if needed
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'WorkingDrawing',
    tableName: 'workingDrawings',
    timestamps: true,
  }
);

export default WorkingDrawing;
