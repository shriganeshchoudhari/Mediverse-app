import { APIRequestContext, request } from '@playwright/test';

export class ApiTestClient {
  private requestContext!: APIRequestContext;
  private baseUrl: string;

  constructor(baseUrl: string = process.env.API_BASE_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  async init(token?: string) {
    this.requestContext = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getHealth() {
    return this.requestContext.get('/api/v1/actuator/health');
  }

  async login(credentials: { email: string; pass: string }) {
    return this.requestContext.post('/api/v1/auth/login', { data: credentials });
  }

  async dispose() {
    await this.requestContext.dispose();
  }
}
