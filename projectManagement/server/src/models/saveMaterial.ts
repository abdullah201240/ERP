import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Service model
interface SaveMaterialAttributes {
    id: number;
    projectId: string;
    productCode: string;
    productName: string; // New column
    quantity: string; // New column

    date: string; // New column
    sisterConcernId: string; // New column

}

interface SaveMaterialCreationAttributes extends Optional<SaveMaterialAttributes, 'id'> { }

// Define the Service model class
class SaveMaterial extends Model<SaveMaterialAttributes, SaveMaterialCreationAttributes> implements SaveMaterialAttributes {
    public id!: number;
    public projectId!: string;
    public productCode!: string;
    public productName!: string; // New column
    public quantity!: string; // New column

    public date!: string; // New column
    public sisterConcernId!: string; // New column
}

SaveMaterial.init(
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
        productCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sisterConcernId: { // New column definition
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db, // Use the passed `sequelizeInstance`
        modelName: 'SaveMaterial',
        tableName: 'saveMaterials', // Specify table name if different from model name
        timestamps: true, // Enable `createdAt` and `updatedAt`
    }
);

export default SaveMaterial;
