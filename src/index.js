import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import EmployeesRouter from './routes/employeesRoute.js';
import swaggerSpec from './misc/swagger.js'; 

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // For the documentation
app.use('/employees', EmployeesRouter);

const PORT = process.env.PORT | 5000;

async function main() {
    try {
        await mongoose.connect(process.env.DB_ADDRESS);

        console.log('Connected to Database');

        app.listen(PORT, () => {
            console.log(`Running on PORT ${PORT}`);
        });
        
    } catch (e) {
        console.log('Failed to connect to Database');
    }
}

main();

export default app;