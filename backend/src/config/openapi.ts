const apiResponse = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    message: { type: "string" },
    data: {},
  },
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Project Tracker API",
    version: "1.0.0",
    description: "Aptavis technical test API for projects, tasks, and dependencies.",
  },
  servers: [{ url: "http://localhost:3000/api", description: "Local development" }],
  paths: {
    "/projects": {
      get: {
        summary: "List projects",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["name", "startDate", "endDate", "createdAt", "updatedAt"] } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { "200": { description: "Projects", content: { "application/json": { schema: apiResponse } } } },
      },
      post: {
        summary: "Create project",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProject" } } } },
        responses: { "201": { description: "Created", content: { "application/json": { schema: apiResponse } } } },
      },
    },
    "/projects/{id}": {
      get: { summary: "Get project", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "200": { description: "Project" } } },
      patch: { summary: "Update project schedule/details", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete project", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "200": { description: "Deleted" } } },
    },
    "/projects/{projectId}/tasks": {
      get: { summary: "Get recursive task tree", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "200": { description: "Task tree" } } },
    },
    "/projects/{projectId}/dependencies": {
      get: { summary: "List project dependencies", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "200": { description: "Dependencies" } } },
      post: { summary: "Create project dependency", parameters: [{ $ref: "#/components/parameters/ProjectId" }], responses: { "201": { description: "Created" } } },
    },
    "/tasks": {
      get: {
        summary: "List tasks",
        parameters: [
          { name: "projectId", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["title", "status", "sortOrder", "createdAt", "updatedAt"] } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { "200": { description: "Tasks" } },
      },
      post: { summary: "Create task", responses: { "201": { description: "Created" } } },
    },
    "/tasks/{id}": {
      get: { summary: "Get task", parameters: [{ $ref: "#/components/parameters/TaskId" }], responses: { "200": { description: "Task" } } },
      patch: { summary: "Update task", parameters: [{ $ref: "#/components/parameters/TaskId" }], responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete task", parameters: [{ $ref: "#/components/parameters/TaskId" }], responses: { "200": { description: "Deleted" } } },
    },
    "/tasks/{taskId}/dependencies": {
      get: { summary: "List task dependencies", parameters: [{ $ref: "#/components/parameters/TaskId" }], responses: { "200": { description: "Dependencies" } } },
      post: { summary: "Create task dependency", parameters: [{ $ref: "#/components/parameters/TaskId" }], responses: { "201": { description: "Created" } } },
    },
  },
  components: {
    parameters: {
      ProjectId: { name: "id", in: "path", required: true, schema: { type: "string" } },
      TaskId: { name: "id", in: "path", required: true, schema: { type: "string" } },
    },
    schemas: {
      CreateProject: {
        type: "object",
        required: ["name", "startDate", "endDate"],
        properties: {
          name: { type: "string", example: "Project Alpha" },
          description: { type: "string", nullable: true },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
