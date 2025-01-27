import Project from './project'; // Adjust the path as needed
import Assigned from './assigned'; // Adjust the path as needed
import PreSiteVisitPlan from './preSiteVisitPlan';
import AssignedPreSiteVisitPlan from './assignedPreSiteVisitPlan';
import ProjectSiteVisitPlan from './projectSiteVisitPlan';
import AssignedProjectSiteVisitPlan from './assignedProjectSiteVisitPlan';
import SupervisionSiteVisitPlan from './supervisionSiteVisitPlan';
import AssignedSupervisionSiteVisitPlan from './assignedSupervisionSiteVisitPlan';

  // A Project can have many Employees
  Project.hasMany(Assigned, {
    foreignKey: 'pid', // Foreign key in Employee table pointing to Project
    as: 'assigned', // Alias for the relation
    onDelete: 'CASCADE', // Ensure cleanup when a project is deleted
  });

  // An Employee belongs to a single Project
  Assigned.belongsTo(Project, {
    foreignKey: 'pid',
    as: 'project',
  });


  // A AssignedPreSiteVisitPlan can have many Employees
  PreSiteVisitPlan.hasMany(AssignedPreSiteVisitPlan, {
    foreignKey: 'preSiteVisitPlanId', // Foreign key in Employee table pointing to Project
    as: 'assigned', // Alias for the relation
    onDelete: 'CASCADE', // Ensure cleanup when a project is deleted
  });

  // An Employee belongs to a single AssignedPreSiteVisitPlan
  AssignedPreSiteVisitPlan.belongsTo(PreSiteVisitPlan, {
    foreignKey: 'preSiteVisitPlanId',
    as: 'preSiteVisitPlan',
  });

  // A AssignedPreSiteVisitPlan can have many Employees
  ProjectSiteVisitPlan.hasMany(AssignedProjectSiteVisitPlan, {
    foreignKey: 'projectSiteVisitPlanId', // Foreign key in Employee table pointing to Project
    as: 'assigned', // Alias for the relation
    onDelete: 'CASCADE', // Ensure cleanup when a project is deleted
  });

  // An Employee belongs to a single AssignedPreSiteVisitPlan
  AssignedProjectSiteVisitPlan.belongsTo(ProjectSiteVisitPlan, {
    foreignKey: 'projectSiteVisitPlanId',
    as: 'projectSiteVisitPlan',
  });


  // A AssignedPreSiteVisitPlan can have many Employees
  SupervisionSiteVisitPlan.hasMany(AssignedSupervisionSiteVisitPlan, {
    foreignKey: 'supervisionSiteVisitPlanId', // Foreign key in Employee table pointing to Project
    as: 'assigned', // Alias for the relation
    onDelete: 'CASCADE', // Ensure cleanup when a project is deleted
  });

  // An Employee belongs to a single AssignedPreSiteVisitPlan
  AssignedSupervisionSiteVisitPlan.belongsTo(SupervisionSiteVisitPlan, {
    foreignKey: 'supervisionSiteVisitPlanId',
    as: 'supervisionSiteVisitPlan',
  });



  export { Project,Assigned ,PreSiteVisitPlan,AssignedPreSiteVisitPlan,SupervisionSiteVisitPlan,AssignedSupervisionSiteVisitPlan};
