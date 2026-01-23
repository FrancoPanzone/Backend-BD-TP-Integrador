// TP Integrador/backend/src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Usamos inferencia de tipos para evitar el error "Cannot find namespace" o "no exported member"
const options: Parameters<typeof swaggerJSDoc>[0] = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Backend - Express + TypeScript',
      version: '1.0.0',
      description: 'Documentación generada automáticamente con Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Cambia si usas proxy o variable de entorno
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          // nombre que usaremos en "security" de las rutas
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

// Genera el documento OpenAPI
const swaggerSpec = swaggerJSDoc(options);

// Función que monta la ruta /api-docs en tu app Express
export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('✅ Swagger disponible en http://localhost:3001/api-docs');
};
