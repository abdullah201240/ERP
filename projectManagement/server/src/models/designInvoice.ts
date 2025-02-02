import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';

interface DesignInvoiceAttributes {
    id: number;
    boqId: string;
    boqName: string;
    clientContact: string;
    clientName: string;
    nowPayAmount: string;
    projectAddress: string;
    subject: string;
    totalFees?: string;
    totalArea?: string;
    date: Date;  // Add date field
}

interface DesignInvoiceCreationAttributes extends Optional<DesignInvoiceAttributes, 'id'> { }

class DesignInvoice extends Model<DesignInvoiceAttributes, DesignInvoiceCreationAttributes> implements DesignInvoiceAttributes {
    public id!: number;
    public boqId!: string;
    public boqName!: string;
    public clientContact!: string;
    public clientName!: string;
    public nowPayAmount!: string;
    public projectAddress!: string;
    public subject!: string;
    public totalFees!: string;
    public totalArea?: string;
    public date!: Date;  // Add date field
}

DesignInvoice.init(
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
        boqName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientContact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nowPayAmount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        projectAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        totalFees: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalArea: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {  // New date field
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Automatically set to current timestamp
        },
    },
    {
        sequelize: db,
        modelName: 'DesignInvoice',
        tableName: 'designInvoices',
        timestamps: true,
    }
);

export default DesignInvoice;
