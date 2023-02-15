import ApiService from '@/services/api.service'
import { MetricsRepository } from '@/domain/models/metrics/metricsRepository'
import { Distribution, Progress, MyProgress, MyProgressList } from '~/domain/models/metrics/metrics'

export class APIMetricsRepository implements MetricsRepository {
  constructor(private readonly request = ApiService) {}

  async fetchCategoryDistribution(projectId: string): Promise<Distribution> {
    let result = Promise.resolve({ user: {} })
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/metrics/category-distribution`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async fetchSpanDistribution(projectId: string): Promise<Distribution> {
    let result = Promise.resolve({ user: {} })
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/metrics/span-distribution`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async fetchRelationDistribution(projectId: string): Promise<Distribution> {
    let result = Promise.resolve({ user: {} })
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/metrics/relation-distribution`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async fetchMemberProgress(projectId: string): Promise<Progress> {
    let result = Promise.resolve({
      total: 0,
      progress: []
    })
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/metrics/member-progress`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async fetchMyProgress(projectId: string): Promise<MyProgress> {
    let result = Promise.resolve({
      total: 0,
      complete: 0,
      remaining: 0,
    })
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/metrics/progress`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async fetchMyProgresses() :Promise<MyProgressList> {
    const url = `/projects/progress`
    const response = await this.request.get(url)
    return response.data
  }

}
