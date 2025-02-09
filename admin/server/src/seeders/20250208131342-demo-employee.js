'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];

    // Create 1000 employees
    for (let i = 1; i <= 1000; i++) {
      employees.push({
        employeeId: `${i}`,
        name: `okay ${i}`,
        email: `emplo${i}@example.com`,
        password: 'password123',  // Make sure to hash this in a real application
        phone: `+8801234789${i}`,
        dob: '1990-01-01', // You can customize this or randomize it
        gender: i % 2 === 0 ? 'Male' : 'Female', // Example alternating genders
        companyId: 3,
        sisterConcernId: 3,
        photo: null,  // Or provide a placeholder photo URL if needed
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert all employees at once
    await queryInterface.bulkInsert('employees', employees, {});
  },

  async down(queryInterface, Sequelize) {
    // This will remove all employees in the seed data
    await queryInterface.bulkDelete('employees', null, {});
  },
};
