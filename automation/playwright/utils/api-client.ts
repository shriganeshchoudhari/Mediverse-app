import { APIRequestContext, request } from '@playwright/test';

export class ApiTestClient {
  private requestContext!: APIRequestContext;
  private baseUrl: string;

  constructor(baseUrl: string = process.env.API_BASE_URL || 'http://localhost:8085') {
    this.baseUrl = baseUrl;
  }

  async init(token?: string) {
    this.requestContext = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getHealth() {
    const res = await this.requestContext.get('/actuator/health');
    if (res.status() === 404) {
      return this.requestContext.get('/api/v1/actuator/health');
    }
    return res;
  }

  async login(credentials: { email: string; password?: string; pass?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password || credentials.pass,
    };
    return this.requestContext.post('/api/v1/auth/login', { data: payload });
  }

  async dispose() {
    await this.requestContext.dispose();
  }
}
