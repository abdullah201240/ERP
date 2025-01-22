import Project from './project'; // Adjust the path as needed
import Assigned from './assigned'; // Adjust the path as needed


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

  export { Project,Assigned };
