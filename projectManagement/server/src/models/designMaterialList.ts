import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';

interface DesignMaterialListAttributes {
  id: number;
  brand: string;
  brandModel: string;
  category: string;
  clientContact: string;
  clientName: string;
  countryOfOrigin: string;
  discountAmount?: string;
  discountPercentage?: string;
  productId: string;
  itemDescription?: string;
  itemName?: string;
  itemNeed?: string;
  itemQuantity?: string;
  mrpPrice?: string;
  productName?: string;
  ourProductCode?: string;
  product_category?: string;
  projectAddress?: string;
  projectId?: string;
  projectName?: string;
  sourcePrice?: string;
  supplierProductCode?: string;
  unit?: string;
  sisterConcernId?: string; // New field added


}

interface DesignMaterialListCreationAttributes extends Optional<DesignMaterialListAttributes, 'id'> {}

class DesignMaterialList extends Model<DesignMaterialListAttributes, DesignMaterialListCreationAttributes>
  implements DesignMaterialListAttributes {
  public id!: number;
  public brand!: string;
  public brandModel!: string;
  public category!: string;
  public clientContact!: string;
  public clientName!: string;
  public countryOfOrigin!: string;
  public discountAmount?: string;
  public discountPercentage?: string;
  public productId!: string;
  public itemDescription?: string;
  public itemName?: string;
  public itemNeed?: string;
  public itemQuantity?: string;
  public mrpPrice?: string;
  public productName?: string;
  public ourProductCode?: string;
  public product_category?: string;
  public projectAddress?: string;
  public projectId?: string;
  public projectName?: string;
  public sourcePrice?: string;
  public supplierProductCode?: string;
  public unit?: string;
  public sisterConcernId?: string; // New field added

  
}

DesignMaterialList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
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
    countryOfOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountPercentage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemNeed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    itemQuantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mrpPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ourProductCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    sourcePrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplierProductCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sisterConcernId: {  // New field definition
        type: DataTypes.STRING,
        allowNull: true,
      },
  },
  {
    sequelize: db,
    modelName: 'DesignMaterialList',
    tableName: 'designMaterialLists',
    timestamps: true,
  }
);

export default DesignMaterialList;