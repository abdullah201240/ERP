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
    image?: string; // New optional field for a single image
    feedbackFile?: string; // New optional field to store multiple image filenames (comma separated)
    feedbackText?: string;
}

interface SaveMaterialCreationAttributes extends Optional<SaveMaterialAttributes, 'id' | 'status' | 'image' | 'feedbackFile'> { }

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
    public image?: string;
    public feedbackFile?: string; // New field for multiple images
    public feedbackText?: string; // New field for multiple images

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
        image: {
            type: DataTypes.STRING, // Storing a single image URL or file path
            allowNull: true, // Optional field
        },
        feedbackFile: {
            type: DataTypes.STRING, // Store multiple image filenames as comma-separated string
            allowNull: true, // Optional field for multiple feedback images
        },
        feedbackText: {
            type: DataTypes.TEXT, // Store multiple image filenames as comma-separated string
            allowNull: true, // Optional field for multiple feedback images
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
