import Employee from '../schemas/employee.js';

// This middleware verifies if the employee exists before checking in or out
async function employeeExists(req, res, next) {

    const employee = await Employee.findOne({ id: req.body.employeeId });

    if (employee)
        return next();
    
    res.status(404).send('Employee ID invalid.');
}

export default employeeExists;