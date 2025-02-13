import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

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
  sisterConcernId?: string; // Add this line
  status?: string;

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
    sisterConcernId: { // Add this line
      type: DataTypes.STRING,
      allowNull: true, // Set it to false if you want this field to be required
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true, // Set it to false if you want this field to be required
      defaultValue: 'pending', // Default value for the status field
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'WorkingDrawing',
    tableName: 'workingDrawings', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default WorkingDrawing;
