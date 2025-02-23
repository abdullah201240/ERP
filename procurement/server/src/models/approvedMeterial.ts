import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ApprovedMeterialAttributes {
  id: number;
  projectId: string;
  projectName: string; 
  materialName: string; 

  description: string; 
  image: string; 

}

interface ApprovedMeterialCreationAttributes extends Optional<ApprovedMeterialAttributes, 'id'> {}

class ApprovedMeterial extends Model<ApprovedMeterialAttributes, ApprovedMeterialCreationAttributes> implements ApprovedMeterialAttributes {
  public id!: number;
  public projectId!: string;
  public projectName!: string; 
  public materialName!: string; 

  public description!: string; 
  public image!: string; 
}

ApprovedMeterial.init(
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
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    materialName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize: db,
    modelName: 'ApprovedMeterial',
    tableName: 'approvedMeterials', // Fixed pluralization issue
    timestamps: true,
  }
);

export default ApprovedMeterial;
