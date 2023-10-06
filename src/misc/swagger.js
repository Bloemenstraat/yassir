import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'Yassir',
      version: '1.0.0',
      description: 'Small project for Yassir recruitement',
    },
  },
  
  apis: [`${process.cwd()}/src/routes/*.js`],
};

const specs = swaggerJsdoc(options);

export default specs;
