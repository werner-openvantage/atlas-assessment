import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Atlas Assessment API',
      version: '1.0.0',
      description: 'API documentation for Atlas Assessment backend',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 1,
              maxLength: 60,
              description: 'User password',
            },
            keepMeSignedIn: {
              type: 'boolean',
              description: 'Keep user signed in',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT token',
                },
                user: {
                  type: 'object',
                  properties: {
                    userId: {
                      type: 'string',
                      description: 'User ID',
                    },
                    organizationId: {
                      type: 'string',
                      description: 'Organization ID',
                    },
                    type: {
                      type: 'string',
                      enum: ['super_admin', 'user'],
                      description: 'User type',
                    },
                    is_archived: {
                      type: 'boolean',
                      description: 'Whether user is archived',
                    },
                  },
                },
                expiresIn: {
                  type: 'number',
                  description: 'Token expiration in days',
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 1,
              maxLength: 60,
              description: 'User password',
            },
            firstName: {
              type: 'string',
              minLength: 1,
              maxLength: 20,
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              minLength: 1,
              maxLength: 20,
              description: 'User last name',
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  description: 'Registration success status',
                },
              },
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              minLength: 1,
              maxLength: 60,
              description: 'New password',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              maxLength: 250,
              description: 'Post ID',
            },
            title: {
              type: 'string',
              maxLength: 250,
              description: 'Post title',
            },
            content: {
              type: 'string',
              maxLength: 250,
              description: 'Post content',
            },
            user_id: {
              type: 'string',
              maxLength: 250,
              description: 'User ID who created the post',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Post creation date',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Post last update date',
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              maxLength: 250,
              description: 'Post title',
            },
            content: {
              type: 'string',
              maxLength: 250,
              description: 'Post content',
            },
          },
        },
        PostResponse: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/Post',
            },
          },
        },
        PostsResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Post',
              },
            },
            count: {
              type: 'number',
              description: 'Total number of posts',
            },
          },
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              maxLength: 250,
              description: 'Post title',
            },
            content: {
              type: 'string',
              maxLength: 250,
              description: 'Post content',
            },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            first_name: {
              type: 'string',
              description: 'User first name',
            },
            last_name: {
              type: 'string',
              description: 'User last name',
            },
            is_super_admin: {
              type: 'boolean',
              description: 'Whether user is super admin',
            },
            is_archived: {
              type: 'boolean',
              description: 'Whether user is archived',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'User last update date',
            },
          },
        },
        UserProfileResponse: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/UserProfile',
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              description: 'User first name',
            },
            last_name: {
              type: 'string',
              description: 'User last name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
          },
        },
        ValidationSuccess: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Validation success status',
            },
            userType: {
              type: 'string',
              enum: ['super_admin', 'user'],
              description: 'User type',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Atlas Assessment API Documentation',
  }));
};

export default specs;
