import Employee from './employee'
import SisterConcern from './sisterConcern'

Employee.belongsTo(SisterConcern, {
  foreignKey: 'sisterConcernId',
  as: 'sisterConcern',
});

SisterConcern.hasMany(Employee, {
  foreignKey: 'sisterConcernId',
  as: 'employees',
});



export {Employee,SisterConcern };
