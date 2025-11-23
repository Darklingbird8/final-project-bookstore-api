import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Bookstore API',
    version: '1.0.0',
    description:
      'Bookstore REST API with JWT auth, role-based and ownership-based authorization. Main resources: authors, books, orders, users.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local dev' },
    { url: 'https://final-project-bookstore-api.onrender.com', description: 'Render prod' },
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
      Author: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
      Book: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'integer' },
          authorId: { type: 'integer' },
        },
      },
      OrderItemInput: {
        type: 'object',
        required: ['book_id', 'quantity'],
        properties: {
          book_id: { type: 'integer', example: 1 },
          quantity: { type: 'integer', example: 2 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          status: { type: 'string' },
          orderItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                orderId: { type: 'integer' },
                bookId: { type: 'integer' },
                quantity: { type: 'integer' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
        },
      },
    },
  },
  tags: [
    { name: 'auth', description: 'Authentication' },
    { name: 'users', description: 'User self-service and admin CRUD' },
    { name: 'authors', description: 'Authors CRUD' },
    { name: 'books', description: 'Books CRUD' },
    { name: 'orders', description: 'Orders CRUD and status updates' },
  ],
  paths: {
    '/api/auth/signup': {
      post: {
        tags: ['auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Login and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'JWT token',
            content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' } } } } },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['users'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User info', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['users'],
        summary: 'Update current user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Updated user' },
          400: { description: 'Validation error' },
        },
      },
      delete: {
        tags: ['users'],
        summary: 'Delete current user',
        security: [{ bearerAuth: [] }],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/api/users': {
      get: {
        tags: ['users'],
        summary: 'List users (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List users' }, 403: { description: 'Forbidden' } },
      },
      post: {
        tags: ['users'],
        summary: 'Create user (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['USER', 'ADMIN'] } },
              },
            },
          },
        },
        responses: { 201: { description: 'Created user' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/authors': {
      get: { tags: ['authors'], summary: 'List authors', responses: { 200: { description: 'Authors' } } },
      post: {
        tags: ['authors'],
        summary: 'Create author (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } } } },
        },
        responses: { 201: { description: 'Created author' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/authors/{id}': {
      get: {
        tags: ['authors'],
        summary: 'Get author by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Author' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['authors'],
        summary: 'Update author (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } } } },
        },
        responses: { 200: { description: 'Updated' }, 403: { description: 'Forbidden' } },
      },
      delete: {
        tags: ['authors'],
        summary: 'Delete author (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Deleted' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/books': {
      get: { tags: ['books'], summary: 'List books', responses: { 200: { description: 'Books' } } },
      post: {
        tags: ['books'],
        summary: 'Create book (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'price', 'stock', 'authorId'],
                properties: {
                  title: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'integer' },
                  authorId: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created book' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/books/{id}': {
      get: {
        tags: ['books'],
        summary: 'Get book by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Book' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['books'],
        summary: 'Update book (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' }, authorId: { type: 'integer' } } } } },
        },
        responses: { 200: { description: 'Updated' }, 403: { description: 'Forbidden' } },
      },
      delete: {
        tags: ['books'],
        summary: 'Delete book (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Deleted' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/orders': {
      get: {
        tags: ['orders'],
        summary: 'Get own orders',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'User orders' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['orders'],
        summary: 'Create order (user)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['order_items'],
                properties: {
                  order_items: { type: 'array', items: { $ref: '#/components/schemas/OrderItemInput' } },
                  status: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created order' }, 400: { description: 'Validation error' } },
      },
    },
    '/api/orders/all': {
      get: {
        tags: ['orders'],
        summary: 'Get all orders (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'All orders' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['orders'],
        summary: 'Get order by id (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Order' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['orders'],
        summary: 'Delete order (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Deleted' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['orders'],
        summary: 'Update order status (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string' } } } } },
        },
        responses: { 200: { description: 'Updated status' }, 403: { description: 'Forbidden' } },
      },
    },
  },
};

export { swaggerUi, swaggerDocument };
