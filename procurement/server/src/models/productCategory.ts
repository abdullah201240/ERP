import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ProductCategoryAttributes {
  id: number;
  name: string;
  
 
}

interface ProductCategoryCreationAttributes extends Optional<ProductCategoryAttributes, 'id'> {}

class ProductCategory extends Model<ProductCategoryAttributes, ProductCategoryCreationAttributes> implements ProductCategoryAttributes {
  public id!: number;
  public name!: string;
  
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
      }
      
      
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'ProductCategory',
      tableName: 'productCategorys', // Specify table name if different from model name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  

export default ProductCategory;
