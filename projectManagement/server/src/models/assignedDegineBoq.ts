import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the assignedDegineBoq model
interface AssignedDegineBoqAttributes {
    id: number;
    boqId: string;
    serviceId: string;
    serviceName: string;
    serviceDescription: string;

    totalFees: string;

    serviceAmount?: string;

    servicePercentage?: string;
    finalAmount?: string;


}

interface AssignedDegineBoqCreationAttributes extends Optional<AssignedDegineBoqAttributes, 'id'> { }

// Define the assignedDegineBoq model class
class AssignedDegineBoq extends Model<AssignedDegineBoqAttributes, AssignedDegineBoqCreationAttributes> implements AssignedDegineBoqAttributes {
    public id!: number;
    public boqId!: string;
    public serviceId!: string;
    public serviceName!: string;
    public serviceDescription!: string;

    public totalFees!: string;

    public serviceAmount?: string;

    public servicePercentage?: string;
    public finalAmount?:string;




}

AssignedDegineBoq.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        boqId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalFees: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceAmount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        servicePercentage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        finalAmount: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize: db, // Use the passed `sequelizeInstance`
        modelName: 'assignedDegineBoq',
        tableName: 'assignedDegineBoqs', // Specify table name if different from model name
        timestamps: true, // Enable `createdAt` and `updatedAt`
    }
);

export default AssignedDegineBoq;
