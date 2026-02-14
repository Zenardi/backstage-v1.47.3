import {
  CostInsightsApi,
  ProductInsightsOptions,
  Alert,
} from '@backstage-community/plugin-cost-insights';
import {
  Cost,
  Entity,
  Group,
  MetricData,
  Project,
} from '@backstage-community/plugin-cost-insights-common';

/**
 * Example implementation of the CostInsightsApi.
 * Replace with your actual cloud cost data source (AWS Cost Explorer, GCP Billing, Azure Cost Management, etc.)
 */
export class ExampleCostInsightsClient implements CostInsightsApi {
  private request(_: any, res: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, 0, res));
  }

  async getLastCompleteBillingDate(): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    return this.request({ userId }, [
      { id: 'zenardi-org', name: 'Zenardi Corp' },
    ]);
  }

  async getGroupProjects(group: string): Promise<Project[]> {
    return this.request({ group }, [
      { id: 'project-a' },
      { id: 'project-b' },
      { id: 'project-c' },
    ]);
  }

  async getAlerts(group: string): Promise<Alert[]> {
    return this.request({ group }, []);
  }

  async getDailyMetricData(
    metric: string,
    intervals: string,
  ): Promise<MetricData> {
    return this.request({ metric, intervals }, {
      id: metric,
      format: 'number',
      aggregation: generateRandomData(intervals).map(value => ({
        date: new Date().toISOString().split('T')[0],
        amount: value,
      })),
      change: {
        ratio: Math.random() * 0.2 - 0.1,
        amount: Math.random() * 1000 - 500,
      },
    });
  }

  async getGroupDailyCost(group: string, intervals: string): Promise<Cost> {
    return this.request({ group, intervals }, {
      id: group,
      aggregation: generateRandomData(intervals).map((value, index) => ({
        date: getDateFromIndex(intervals, index),
        amount: value,
      })),
      change: {
        ratio: Math.random() * 0.2 - 0.1,
        amount: Math.random() * 5000 - 2500,
      },
      trendline: {
        slope: Math.random() * 10 - 5,
        intercept: Math.random() * 10000,
      },
      groupedCosts: {
        service: [
          {
            id: 'compute',
            aggregation: generateRandomData(intervals).map((value, index) => ({
              date: getDateFromIndex(intervals, index),
              amount: value * 0.4,
            })),
            change: {
              ratio: Math.random() * 0.1,
              amount: Math.random() * 1000,
            },
          },
          {
            id: 'storage',
            aggregation: generateRandomData(intervals).map((value, index) => ({
              date: getDateFromIndex(intervals, index),
              amount: value * 0.3,
            })),
            change: {
              ratio: Math.random() * 0.1,
              amount: Math.random() * 500,
            },
          },
          {
            id: 'networking',
            aggregation: generateRandomData(intervals).map((value, index) => ({
              date: getDateFromIndex(intervals, index),
              amount: value * 0.2,
            })),
            change: {
              ratio: Math.random() * 0.1,
              amount: Math.random() * 300,
            },
          },
          {
            id: 'database',
            aggregation: generateRandomData(intervals).map((value, index) => ({
              date: getDateFromIndex(intervals, index),
              amount: value * 0.1,
            })),
            change: {
              ratio: Math.random() * 0.05,
              amount: Math.random() * 200,
            },
          },
        ],
      },
    });
  }

  async getProjectDailyCost(
    project: string,
    intervals: string,
  ): Promise<Cost> {
    return this.getGroupDailyCost(project, intervals);
  }

  async getCatalogEntityDailyCost(
    catalogEntityRef: string,
    intervals: string,
  ): Promise<Cost> {
    return this.getGroupDailyCost(catalogEntityRef, intervals);
  }

  async getProductInsights(
    options: ProductInsightsOptions,
  ): Promise<Entity> {
    return this.request(options, {
      id: options.product,
      aggregation: [Math.random() * 10000, Math.random() * 10000],
      change: {
        ratio: Math.random() * 0.2 - 0.1,
        amount: Math.random() * 2000 - 1000,
      },
      entities: {},
    });
  }
}

function generateRandomData(intervals: string): number[] {
  const days = intervals.includes('P30D') ? 30 : 90;
  return Array.from({ length: days }, () => Math.random() * 500 + 100);
}

function getDateFromIndex(intervals: string, index: number): string {
  const date = new Date();
  const days = intervals.includes('P30D') ? 30 : 90;
  date.setDate(date.getDate() - (days - index));
  return date.toISOString().split('T')[0];
}
