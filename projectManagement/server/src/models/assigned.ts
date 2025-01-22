import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Assigned model
interface AssignedAttributes {
  id: number;
  eid: string;
  eName: string;
  pid: number;
}

interface AssignedCreationAttributes extends Optional<AssignedAttributes, 'id'> {}

// Define the Assigned model class
class Assigned extends Model<AssignedAttributes, AssignedCreationAttributes> implements AssignedAttributes {
  public id!: number;
  public eid!: string;
  public eName!: string;
  public pid!: number;
  
}

Assigned.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    eid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'Assigned',
    tableName: 'assigneds', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default Assigned;
