import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize';  // Sequelize instance
import Projects from './project';  // Import Projects model

// Define the attributes for the workingDrawingImage model
interface WorkingDrawingImageAttributes {
  id: number;
  imageName: string;
  workingDrawingId: number; // Foreign key reference to Projects
}

interface WorkingDrawingImageCreationAttributes extends Optional<WorkingDrawingImageAttributes, 'id'> {}

class WorkingDrawingImage extends Model<WorkingDrawingImageAttributes, WorkingDrawingImageCreationAttributes> implements WorkingDrawingImageAttributes {
  public id!: number;
  public imageName!: string;
  public workingDrawingId!: number;

  public readonly project?: Projects; // Association with Project
}

WorkingDrawingImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workingDrawingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'WorkingDrawingImage',
    tableName: 'workingDrawingImage',
    timestamps: true,
  }
);





export default WorkingDrawingImage;
