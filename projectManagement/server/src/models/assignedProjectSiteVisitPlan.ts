import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the AssignedProjectSiteVisitPlan model
interface AssignedProjectSiteVisitPlanAttributes {
  id: number;
  eid: string;
  eName: string;
  projectSiteVisitPlanId: string;
}

interface AssignedProjectSiteVisitPlanCreationAttributes extends Optional<AssignedProjectSiteVisitPlanAttributes, 'id'> {}

// Define the AssignedProjectSiteVisitPlan model class
class AssignedProjectSiteVisitPlan extends Model<AssignedProjectSiteVisitPlanAttributes, AssignedProjectSiteVisitPlanCreationAttributes> implements AssignedProjectSiteVisitPlanAttributes {
  public id!: number;
  public eid!: string;
  public eName!: string;
  public projectSiteVisitPlanId!: string;
  
}

AssignedProjectSiteVisitPlan.init(
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
    projectSiteVisitPlanId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'AssignedProjectSiteVisitPlan',
    tableName: 'assignedProjectSiteVisitPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default AssignedProjectSiteVisitPlan;
