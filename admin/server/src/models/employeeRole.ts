import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the EmployeeRole model
interface EmployeeRoleAttributes {
    id: number;
    employee_id: number;
    permission_id: number;
}

interface EmployeeRoleCreationAttributes extends Optional<EmployeeRoleAttributes, 'id'> { }

// Define the EmployeeRole model class
class EmployeeRole extends Model<EmployeeRoleAttributes, EmployeeRoleCreationAttributes> implements EmployeeRoleAttributes {
    public id!: number;
    public permission_id!: number;
    public employee_id!: number;
}

EmployeeRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
    },
    {
        sequelize: db, // Use the passed `sequelizeInstance`
        modelName: 'EmployeeRole',
        tableName: 'employee_permissions', // Use snake_case for table name
        timestamps: true, // Enable `createdAt` and `updatedAt`
    }
);

export default EmployeeRole;