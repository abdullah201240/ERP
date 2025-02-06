import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the SisterConcern model
interface SisterConcernAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  logo: string;
  companyId: number;
  companyEmail: string;
 
}

interface SisterConcernCreationAttributes extends Optional<SisterConcernAttributes, 'id'> {}

// Define the SisterConcern model class
class SisterConcern extends Model<SisterConcernAttributes, SisterConcernCreationAttributes> implements SisterConcernAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public logo!: string;
  public companyId!: number;
  public companyEmail!: string;

  }

  SisterConcern.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Ensure email is valid
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      companyEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'SisterConcern',
      tableName: 'sisterConcerns', // Specify table name if different from model name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  

export default SisterConcern;
