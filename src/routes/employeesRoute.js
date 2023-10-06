import express from 'express';
import Employee from '../schemas/employee.js';
import WorkSlot from '../schemas/workslot.js';
import generateId from '../misc/generateId.js';
import employeeExists from '../middlewares/employeeExists.js';

const EmployeesRouter = express.Router();

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     description: Create a new employee in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee created successfully
 *       409:
 *         description: Employee already exists
 *       500:
 *         description: Internal server error
 */
EmployeesRouter.post('/', async (req, res) => {

    // Check if employee name and family name already exist
    try {
        const duplicate = await Employee.findOne({ lastName: req.body.lastName, firstName: req.body.firstName });

        if (duplicate)
            return res.status(409).send('First name and last name already in use.');
        
    } catch (e) {
        return res.status(500).send(`Internal server error while accessing Database. REASON: ${e._message}`);
    }    

    // Creating the new employee and saving to the Database
    const newEmployee = new Employee({
        "id": `${await generateId()}`,
        "lastName": req.body.lastName,
        "firstName": req.body.firstName,
        "dateCreated": (new Date()), //.toISOString().split('T')[0],
        "department":  req.body.department
    });

    try {
        await newEmployee.save();
    } catch (e) {
        return res.status(500).send(`Couldn't save employee info to database.
                                        REASON: ${e._message} 
                                        DETAILS: ${JSON.stringify(e.errors)}`);
    }

    res.status(200).send('Employee successfully created.');
});

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get a list of employees
 *     description: Retrieve a list of employees. You can filter by date.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: YYYY-MM-DD
 *         description: Optional. Filter employees by date .
 *     responses:
 *       200:
 *         description: List of employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: Bad request. Invalid date format.
 *       500:
 *         description: Internal server error
 */
EmployeesRouter.get('/:date?', async (req, res) => {

    let searchFilter = {};

    if (req.params.date) {
        const isValid = /^\d{4}-[0-1][0-9]-[0-3][0-9]$/.test(req.params.date);
        
        if (!isValid)
            return res.status(400).send("The parameters isn't in the correct date format: YYYY-MM-DD");

        // Date of creating in the database contains time of creation
        // The following code searches the database for a given date between the start and the end of the day
        const targetDate = new Date(req.params.date); 

        // Calculate the start and end of the day for the target date
        const startDate = new Date(targetDate);
        const endDate = new Date(targetDate);
        endDate.setDate(targetDate.getDate() + 1);

        searchFilter = { dateCreated: { $gte: startDate, $lt: endDate } };
    }

    try {
        const employees = await Employee.find(searchFilter);        
        return res.status(200).send(employees);
    } catch (e) {
        return res.status(500).send(`Error when reading database. REASON: ${e._message}`);
    }
});

/**
 * @swagger
 * /check-in:
 *   post:
 *     summary: Check-in an employee
 *     description: Check-in an employee with an optional comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               comment:
 *                 type: string
 *             required:
 *               - employeeId
 *     responses:
 *       200:
 *         description: Employee checked in successfully
 *       400:
 *         description: Bad request. Comment length exceeds 150 characters.
 *       409:
 *         description: Conflict. Employee is already checked-in.
 *       500:
 *         description: Internal server error
 */  
EmployeesRouter.post('/check-in', employeeExists, async (req, res) => {

    let alreadyCheckedIn;

    // Check if already checked in
    try {
        alreadyCheckedIn = await WorkSlot.findOne({ employeeId: req.body.employeeId, checkOut: false });
    } catch (e) {
        return res.status(500).send(`Error when reading database. REASON: ${e._message}`);
    }

    if (alreadyCheckedIn)
        return res.status(409).send('This employee is already checked-in. Please check him out.');

    let comment = req.body.comment ? req.body.comment : "";
    
    if (comment.length > 150)
        return res.status(400).send("Comment length shouldn't exceed 150 characters");


    const newSlot = new WorkSlot({
        employeeId: req.body.employeeId,
        checkIn: (new Date()),
        checkOut: false,
        comment: comment
    });

    try {
        await newSlot.save();
        return res.status(200).send(`Successfully checked in employee ${req.body.employeeId}`);
    } catch (e) {
        return res.status(500).send(`Error when writing to database. REASON: ${e._message}`);
    }  
    
});

/**
 * @swagger
 * /check-out:
 *   post:
 *     summary: Check-out an employee
 *     description: Check-out an employee with an optional comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               comment:
 *                 type: string
 *             required:
 *               - employeeId
 *     responses:
 *       200:
 *         description: Employee checked out successfully
 *       400:
 *         description: Bad request. Comment length exceeds 150 characters.
 *       409:
 *         description: Conflict. Employee is not checked-in.
 *       500:
 *         description: Internal server error
 */  
EmployeesRouter.post('/check-out', employeeExists, async (req, res) => {

    let slot;
    
    // Check if already checked in
    try {
        slot = await WorkSlot.findOne({ employeeId: req.body.employeeId, checkOut: false });
    } catch (e) {
        return res.status(500).send(`Error when reading database. REASON: ${e._message}`);
    }

    if (!slot)
        return res.status(409).send('This employee is not checked-in. Please check him in.');

    let comment = req.body.comment ? req.body.comment : "";

    if (comment.length > 150)
        return res.status(400).send("Comment length shouldn't exceed 150 characters");

    slot.checkOut = (new Date());
    slot.comment = (slot.comment == "") ? comment : `${slot.comment}. ${comment}`; // Concatenate old and new comments if an old one exists.

    // Calculate the time this employee has worked
    slot.timeWorked = ((slot.checkOut.getTime() - slot.checkIn.getTime()) / 60000).toFixed(2); // Time elapsed in minutes

    try {
        await slot.save();
        return res.status(200).send(`Successfully checked out employee ${req.body.employeeId}`);
    } catch (e) {
        return res.status(500).send(`Error when writing to database. REASON: ${e._message}`);
    }
    
});

export default EmployeesRouter;