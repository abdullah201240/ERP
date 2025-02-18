import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the SaveMaterial model
interface SaveMaterialAttributes {
    id: number;
    projectId: string;
    productCode: string;
    productName: string;
    quantity: string;
    date: string;
    sisterConcernId: string;
    status?: string; // New column (optional)
}

interface SaveMaterialCreationAttributes extends Optional<SaveMaterialAttributes, 'id' | 'status'> { }

// Define the SaveMaterial model class
class SaveMaterial extends Model<SaveMaterialAttributes, SaveMaterialCreationAttributes> implements SaveMaterialAttributes {
    public id!: number;
    public projectId!: string;
    public productCode!: string;
    public productName!: string;
    public quantity!: string;
    public date!: string;
    public sisterConcernId!: string;
    public status?: string;
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
        sisterConcernId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'pending', // Set default value to 'pending'
        },
    },
    {
        sequelize: db,
        modelName: 'SaveMaterial',
        tableName: 'saveMaterials',
        timestamps: true,
    }
);

export default SaveMaterial;
