declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi: string;
    info: {
      title: string;
      version: string;
      description?: string;
    };
    servers?: Array<{ url: string }>;
    [key: string]: any;
  }

  interface SwaggerJSDocOptions {
    definition: SwaggerDefinition;
    apis: string[];
  }

  export default function swaggerJSDoc(options: SwaggerJSDocOptions): Record<string, any>;
}
