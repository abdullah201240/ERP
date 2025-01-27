import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the AssignedSupervisionSiteVisitPlan model
interface AssignedSupervisionSiteVisitPlanAttributes {
  id: number;
  eid: string;
  eName: string;
  supervisionSiteVisitPlanId: string;
}

interface AssignedSupervisionSiteVisitPlanCreationAttributes extends Optional<AssignedSupervisionSiteVisitPlanAttributes, 'id'> {}

// Define the AssignedSupervisionSiteVisitPlan model class
class AssignedSupervisionSiteVisitPlan extends Model<AssignedSupervisionSiteVisitPlanAttributes, AssignedSupervisionSiteVisitPlanCreationAttributes> implements AssignedSupervisionSiteVisitPlanAttributes {
  public id!: number;
  public eid!: string;
  public eName!: string;
  public supervisionSiteVisitPlanId!: string;
  
}

AssignedSupervisionSiteVisitPlan.init(
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
    supervisionSiteVisitPlanId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'AssignedSupervisionSiteVisitPlan',
    tableName: 'assignedSupervisionSiteVisitPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default AssignedSupervisionSiteVisitPlan;
