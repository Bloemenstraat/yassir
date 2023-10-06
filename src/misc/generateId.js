import Employee from '../schemas/employee.js';

// Generates a unique 4-digit ID for the employees
async function generateId() {
    while (true) {
        const uniqueId = Math.floor(1000 + Math.random() * 9000);
        const existingEntry = await Employee.findOne({ id: uniqueId });

        if (!existingEntry) {
            return uniqueId;
        }
    }
}

export default generateId;