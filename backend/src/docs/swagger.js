const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Notes API",
    version: "1.0.0",
    description:
      "API RESTful pour gérer des notes catégorisées avec authentification JWT, recherche et upload de fichiers.",
  },
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:5000/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Note: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          category: {
            type: "string",
            enum: ["travail", "personnel", "urgent"],
          },
          attachment: {
            type: "object",
            nullable: true,
            properties: {
              filename: { type: "string" },
              url: { type: "string" },
              mimetype: { type: "string" },
              size: { type: "number" },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "Authentification des utilisateurs" },
    { name: "Notes", description: "Gestion des notes" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Créer un compte utilisateur",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Utilisateur créé",
          },
          422: { description: "Requête invalide" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Se connecter et récupérer un token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Connexion réussie" },
          400: { description: "Identifiants invalides" },
        },
      },
    },
    "/notes": {
      get: {
        tags: ["Notes"],
        summary: "Lister les notes de l'utilisateur connecté",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "category",
            in: "query",
            schema: {
              type: "string",
              enum: ["all", "travail", "personnel", "urgent"],
            },
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["latest", "oldest", "category"] },
          },
        ],
        responses: {
          200: {
            description: "Liste paginée des notes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    notes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Note" },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        tags: ["Notes"],
        summary: "Créer une nouvelle note",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "category"],
                properties: {
                  title: { type: "string" },
                  category: {
                    type: "string",
                    enum: ["travail", "personnel", "urgent"],
                  },
                  content: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Note créée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Note" },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/notes/{id}": {
      get: {
        tags: ["Notes"],
        summary: "Récupérer une note par son identifiant",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Note trouvée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Note" },
              },
            },
          },
          404: { description: "Note introuvable" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Notes"],
        summary: "Mettre à jour une note",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  category: {
                    type: "string",
                    enum: ["travail", "personnel", "urgent"],
                  },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Note mise à jour" },
          404: { description: "Note introuvable" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Notes"],
        summary: "Supprimer une note",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Note supprimée" },
          404: { description: "Note introuvable" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/notes/stats/overview": {
      get: {
        tags: ["Notes"],
        summary: "Statistiques globales des notes",
        responses: {
          200: {
            description: "Statistiques par catégorie et autres indicateurs",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

module.exports = swaggerJsdoc(options);

