import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ProductAttributes {
  id: number;
  name: string;
  brand: string;
  countryOfOrigin: string;
  sizeAndDimension: string;
  category: string;
  supplierProductCode: string;
  ourProductCode: string;
  mrpPrice: string;
  discountPercentage: string;
  discountAmount: string;
  sourcePrice: string;
  unit: string;
  product_category: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public brand!: string;
  public countryOfOrigin!: string;
  public sizeAndDimension!: string;
  public category!: string;
  public supplierProductCode!: string;
  public ourProductCode!: string;
  public mrpPrice!: string;
  public discountPercentage!: string;
  public discountAmount!: string;
  public sourcePrice!: string;
  public unit!: string;
  public product_category!: string;
}

Product.init(
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
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryOfOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sizeAndDimension: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplierProductCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ourProductCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mrpPrice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sourcePrice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'Product',
    tableName: 'products', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default Product;
