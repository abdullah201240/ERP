import { Association, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed
import AssignedPreSiteVisitPlan from './assignedPreSiteVisitPlan';

// Define the attributes for the PreSiteVisitPlan model
interface PreSiteVisitPlanAttributes {
  id: number;
  projectName: string;
  projectId: string;
  clientName: string;
  clientNumber: string;
  ProjectAddress: string;
  visitDateTime: string;
}

interface PreSiteVisitPlanCreationAttributes extends Optional<PreSiteVisitPlanAttributes, 'id'> {}

// Define the PreSiteVisitPlan model class
class PreSiteVisitPlan
  extends Model<PreSiteVisitPlanAttributes, PreSiteVisitPlanCreationAttributes>
  implements PreSiteVisitPlanAttributes
{
  public id!: number;
  public projectName!: string;
  public projectId!: string;
  public clientName!: string;
  public clientNumber!: string;
  public ProjectAddress!: string;
  public visitDateTime!: string;
  // Associations
  public assigned?: AssignedPreSiteVisitPlan[];

  static associations: {
    assigned: Association<PreSiteVisitPlan, AssignedPreSiteVisitPlan>;
  };

}

PreSiteVisitPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProjectAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visitDateTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Use the passed `sequelizeInstance`
    modelName: 'PreSiteVisitPlan',
    tableName: 'preSiteVisitPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default PreSiteVisitPlan;
