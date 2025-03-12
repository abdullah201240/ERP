import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Permission model
interface PermissionAttributes {
  id: number;
  permission_name: string;
  
 
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}

// Define the Permission model class
class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public permission_name!: string;
  
  }

  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
     
      
      
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Permission',
      tableName: 'permissions', // Specify table name if different from model name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  

export default Permission;
