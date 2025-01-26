import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the AssignedPreSiteVisitPlan model
interface AssignedPreSiteVisitPlanAttributes {
  id: number;
  eid: string;
  eName: string;
  preSiteVisitPlanId: string;
}

interface AssignedPreSiteVisitPlanCreationAttributes extends Optional<AssignedPreSiteVisitPlanAttributes, 'id'> {}

// Define the AssignedPreSiteVisitPlan model class
class AssignedPreSiteVisitPlan extends Model<AssignedPreSiteVisitPlanAttributes, AssignedPreSiteVisitPlanCreationAttributes> implements AssignedPreSiteVisitPlanAttributes {
  public id!: number;
  public eid!: string;
  public eName!: string;
  public preSiteVisitPlanId!: string;
  
}

AssignedPreSiteVisitPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    eid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preSiteVisitPlanId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'AssignedPreSiteVisitPlan',
    tableName: 'assignedPreSiteVisitPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default AssignedPreSiteVisitPlan;
