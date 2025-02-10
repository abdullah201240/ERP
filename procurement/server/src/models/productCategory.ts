import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ProductCategoryAttributes {
  id: number;
  name: string;
  sisterConcernId: number; // New column
}

interface ProductCategoryCreationAttributes extends Optional<ProductCategoryAttributes, 'id'> {}

class ProductCategory extends Model<ProductCategoryAttributes, ProductCategoryCreationAttributes> implements ProductCategoryAttributes {
  public id!: number;
  public name!: string;
  public sisterConcernId!: number;
}

ProductCategory.init(
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
    modelName: 'ProductCategory',
    tableName: 'productCategorys', // Fixed pluralization issue
    timestamps: true,
  }
);

export default ProductCategory;
