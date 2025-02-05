import Project from './project'; // Adjust the path as needed
import Assigned from './assigned'; // Adjust the path as needed
import PreSiteVisitPlan from './preSiteVisitPlan';
import AssignedPreSiteVisitPlan from './assignedPreSiteVisitPlan';
import ProjectSiteVisitPlan from './projectSiteVisitPlan';
import AssignedProjectSiteVisitPlan from './assignedProjectSiteVisitPlan';
import SupervisionSiteVisitPlan from './supervisionSiteVisitPlan';
import AssignedSupervisionSiteVisitPlan from './assignedSupervisionSiteVisitPlan';
import DesignPlan from './designPlan';
import Employee from './employee';
import DegineBOQ from './degineBOQ';
import AssignedDegineBoq from './assignedDegineBoq';
import WorkingDrawing from './workingDrawing'; // Import WorkingDrawing model
import WorkingDrawingImage from './workingDrawingImage'; // Import WorkingDrawingImage model
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




// Relation: A Project has many DesignPlans
Project.hasMany(DesignPlan, {
  foreignKey: 'projectId', // Foreign key in DesignPlan pointing to Project
  as: 'designPlans', // Alias for the relation
  onDelete: 'CASCADE', // Cleanup when a project is deleted
});

// Relation: A DesignPlan belongs to a single Project
DesignPlan.belongsTo(Project, {
  foreignKey: 'projectId', // Foreign key in DesignPlan
  as: 'project', // Alias for accessing the related Project
});

// Relation: An Employee can be assigned to many DesignPlans
Employee.hasMany(DesignPlan, {
  foreignKey: 'assignee', // Foreign key in DesignPlan pointing to Employee
  as: 'designPlans', // Alias for the relation
});

// Relation: A DesignPlan belongs to a single Employee
DesignPlan.belongsTo(Employee, {
  foreignKey: 'assignee', // Foreign key in DesignPlan
  as: 'employee', // Alias for accessing the related Employee
});



// A AssignedPreSiteVisitPlan can have many Employees
DegineBOQ.hasMany(AssignedDegineBoq, {
  foreignKey: 'boqId', // Foreign key in Employee table pointing to Project
  as: 'assigned', // Alias for the relation
  onDelete: 'CASCADE', // Ensure cleanup when a project is deleted
});

// An Employee belongs to a single AssignedPreSiteVisitPlan
AssignedDegineBoq.belongsTo(DegineBOQ, {
  foreignKey: 'boqId',
  as: 'boq',
});

// A WorkingDrawing can have many WorkingDrawingImages
WorkingDrawing.hasMany(WorkingDrawingImage, {
  foreignKey: 'workingDrawingId', // Foreign key in WorkingDrawingImage pointing to WorkingDrawing
  as: 'images', // Alias for the relation
  onDelete: 'CASCADE', // Cleanup when a WorkingDrawing is deleted
});

// A WorkingDrawingImage belongs to a single WorkingDrawing
WorkingDrawingImage.belongsTo(WorkingDrawing, {
  foreignKey: 'workingDrawingId', // Foreign key in WorkingDrawingImage
  as: 'workingDrawing', // Alias for accessing the related WorkingDrawing
});



export { Project,DegineBOQ,AssignedDegineBoq, Employee,DesignPlan, Assigned, PreSiteVisitPlan, AssignedPreSiteVisitPlan, SupervisionSiteVisitPlan, AssignedSupervisionSiteVisitPlan,WorkingDrawing,
  WorkingDrawingImage };
