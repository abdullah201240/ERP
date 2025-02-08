import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Employee model
interface EmployeeAttributes {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: string;
  companyId: number;
  sisterConcernId: number;
  photo: string;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}

// Define the Employee model class
class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public employeeId!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public dob!: string;
  public gender!: string;
  public companyId!: number;
  public sisterConcernId!: number;
  public photo!: string;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sisterConcernId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);

export default Employee;
