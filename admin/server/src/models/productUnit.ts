import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

interface ProductUnitAttributes {
  id: number;
  name: string;
  
 
}

interface ProductUnitCreationAttributes extends Optional<ProductUnitAttributes, 'id'> {}

class ProductUnit extends Model<ProductUnitAttributes, ProductUnitCreationAttributes> implements ProductUnitAttributes {
  public id!: number;
  public name!: string;
  
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
      }
      
      
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'ProductUnit',
      tableName: 'productUnits', // Specify table name if different from model name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  

export default ProductUnit;
