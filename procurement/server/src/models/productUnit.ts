import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ProductUnitAttributes {
  id: number;
  name: string;
  sisterConcernId: number; // New column
}

interface ProductUnitCreationAttributes extends Optional<ProductUnitAttributes, 'id'> {}

class ProductUnit extends Model<ProductUnitAttributes, ProductUnitCreationAttributes> implements ProductUnitAttributes {
  public id!: number;
  public name!: string;
  public sisterConcernId!: number;
}

ProductUnit.init(
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
    sisterConcernId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'ProductUnit',
    tableName: 'productUnits',
    timestamps: true,
  }
);

export default ProductUnit;
