/**
 * Bags API Wrapper
 * Base URL: https://public-api-v2.bags.fm/api/v1/
 */

const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

export interface BagsProject {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  marketCap: number;
  volume24h: number;
  totalFees: number;
  stars: number;
  launchTimestamp: number;
}

export interface Trade {
  id: string;
  projectId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  trader: string;
}

class BagsAPI {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.apiKey) {
      headers.set('x-api-key', this.apiKey);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API Request failed' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get project details by creator address
   */
  async getProjectByCreator(address: string): Promise<BagsProject> {
    // In a real implementation, this would call the /creator/:address endpoint
    // For now, we return mock data that matches the expected interface
    return this.request<BagsProject>(`/projects/creator/${address}`);
  }

  /**
   * Get trending projects (for the Alpha Feed)
   */
  async getTrendingProjects(): Promise<BagsProject[]> {
    return this.request<BagsProject[]>('/projects/trending');
  }

  /**
   * Get recent trades for a project
   */
  async getRecentTrades(projectId: string): Promise<Trade[]> {
    return this.request<Trade[]>(`/projects/${projectId}/trades`);
  }

  /**
   * Get total fees earned for a project (Real Traction metric)
   */
  async getProjectStats(projectId: string) {
    return this.request<{ totalFees: number; volume: number; marketCap: number }>(`/projects/${projectId}/stats`);
  }
}

export const bagsApi = new BagsAPI();
