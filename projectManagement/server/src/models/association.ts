import Project from './project'; // Adjust the path as needed
import Assigned from './assigned'; // Adjust the path as needed
import PreSiteVisitPlan from './preSiteVisitPlan';
import AssignedPreSiteVisitPlan from './assignedPreSiteVisitPlan';

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

  export { Project,Assigned ,PreSiteVisitPlan,AssignedPreSiteVisitPlan};
