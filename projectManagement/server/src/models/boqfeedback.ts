import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Boqfeedback model
interface BoqfeedbackAttributes {
  id: number;
  feedback: string;
  drawingId: string;
  sisterConcernId: string;
  status?: string;
}

interface BoqfeedbackCreationAttributes extends Optional<BoqfeedbackAttributes, 'id'> {}

class Boqfeedback extends Model<BoqfeedbackAttributes, BoqfeedbackCreationAttributes> implements BoqfeedbackAttributes {
  public id!: number;
  public feedback!: string;
  public drawingId!: string;
  public sisterConcernId!: string;
  public status?: string;
}

Boqfeedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drawingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sisterConcernId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize: db,
    modelName: 'Boqfeedback',
    tableName: 'boqfeedbacks',
    timestamps: true,
  }
);

export default Boqfeedback;