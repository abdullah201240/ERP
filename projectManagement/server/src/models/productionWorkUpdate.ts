import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the ProductionWorkPlan model
interface ProductionWorkUpdateAttributes {
  id: number;
  workingDrawingsId: string;
  productionWorkPlansId: string;
  date: string;
  workUpdate: string;
 
}

interface ProductionWorkUpdateCreationAttributes extends Optional<ProductionWorkUpdateAttributes, 'id'> {}

// Define the ProductionWorkPlan model class
class ProductionWorkUpdate extends Model<ProductionWorkUpdateAttributes, ProductionWorkUpdateCreationAttributes> implements ProductionWorkUpdateAttributes {
  public id!: number;
  public workingDrawingsId!: string;
  public productionWorkPlansId!: string;
  public date!: string;
  public workUpdate!: string;
}

ProductionWorkUpdate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    workingDrawingsId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productionWorkPlansId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workUpdate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

  },
  {
    sequelize: db,
    modelName: 'ProductionWorkUpdate',
    tableName: 'productionWorkUpdate',
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default ProductionWorkUpdate;
