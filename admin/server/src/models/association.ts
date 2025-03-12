import Employee from './employee'
import EmployeeRole from './employeeRole';
import Permission from './permission';
import SisterConcern from './sisterConcern'

Employee.belongsTo(SisterConcern, {
  foreignKey: 'sisterConcernId',
  as: 'sisterConcern',
});

SisterConcern.hasMany(Employee, {
  foreignKey: 'sisterConcernId',
  as: 'employees',
});
// Define associations
Employee.hasMany(EmployeeRole, { foreignKey: 'employee_id' });
EmployeeRole.belongsTo(Employee, { foreignKey: 'employee_id' });




Employee.hasMany(EmployeeRole, { foreignKey: 'employee_id' });
EmployeeRole.belongsTo(Employee, { foreignKey: 'employee_id' });




export {Employee,SisterConcern , EmployeeRole,Permission};
