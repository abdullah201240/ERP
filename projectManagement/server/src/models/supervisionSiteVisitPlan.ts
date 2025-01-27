import { Association, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed
import AssignedSupervisionSiteVisitPlan from './assignedSupervisionSiteVisitPlan';

// Define the attributes for the ProjectSiteVisitPlan model
interface SupervisionSiteVisitPlanAttributes {
  id: number;
  projectName: string;
  projectId: string;
  clientName: string;
  clientNumber: string;
  projectAddress: string;
  visitDateTime: string;
}

interface SupervisionSiteVisitPlanCreationAttributes extends Optional<SupervisionSiteVisitPlanAttributes, 'id'> {}

// Define the ProjectSiteVisitPlan model class
class SupervisionSiteVisitPlan
  extends Model<SupervisionSiteVisitPlanAttributes, SupervisionSiteVisitPlanCreationAttributes>
  implements SupervisionSiteVisitPlanAttributes
{
  public id!: number;
  public projectName!: string;
  public projectId!: string;
  public clientName!: string;
  public clientNumber!: string;
  public projectAddress!: string;
  public visitDateTime!: string;
  // Associations
  public assigned?: AssignedSupervisionSiteVisitPlan[];

  static associations: {
    assigned: Association<SupervisionSiteVisitPlan, AssignedSupervisionSiteVisitPlan>;
  };

}

SupervisionSiteVisitPlan.init(
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
    projectAddress: {
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
    modelName: 'SupervisionSiteVisitPlan',
    tableName: 'supervisionSiteVisitPlans', // Specify table name if different from model name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default SupervisionSiteVisitPlan;
