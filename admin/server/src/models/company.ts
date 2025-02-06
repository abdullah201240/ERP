import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Company model
interface CompanyAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  logo: string;
 
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

// Define the Company model class
class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public logo!: string;
  }

  Company.init(
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
      
      
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Company',
      tableName: 'companies', // Specify table name if different from model name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  

export default Company;
