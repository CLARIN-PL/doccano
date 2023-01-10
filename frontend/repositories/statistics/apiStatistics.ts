import ApiService from '@/services/api.service'
import { StatisticsRepository } from '@/domain/models/statistics/statisticsRepository'
import {
  UserItemDoneCount, AllUsersItemDoneCount,
  DailyAverageTime, UserAverageTime, AllUsersAverageTime
} from '~/domain/models/statistics/statistics'

export class APIStatisticsRepository implements StatisticsRepository {
  constructor(private readonly request = ApiService) {}

  async fetchUserAnnotationsCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount> {
    const url = `/report/each-member-progress-between-startdate-enddate/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    if ("progress" in response.data && response.data.progress.length > 0) {
      return new UserItemDoneCount(response.data.progress[0].user, response.data.progress[0].done)
    }
    return new UserItemDoneCount('', 0)
  }

  async fetchUserEveningQuestionnairesCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount> {
    const url = `/report/each-member-evening-questionnaire-progress/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    if ("progress" in response.data && response.data.progress.length > 0) {
      return new UserItemDoneCount(response.data.progress[0].user, response.data.progress[0].done)
    }
    return new UserItemDoneCount('', 0)
  }

  async fetchUserAverageTimeAnnotation(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/avg-daily-annotation-time/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_average_annotation_time" in response.data) {
      dailyAverageTime = response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item['average_annotation_time (seconds)'])
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      response.data['average_annotation_time (seconds)'],
      dailyAverageTime
    )
  }

  async fetchUserAverageTimeQuestionnaire(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/avg-daily-questionnaire-time/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_questionnaire_time" in response.data) {
      dailyAverageTime = response.data.daily_questionnaire_time.map((item: any) => 
        new DailyAverageTime(item.date, item['total_time (seconds)'])
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      response.data['average_daily_questionnaire_time (seconds)'],
      dailyAverageTime
    )
  }

  async fetchUserAverageTimeText(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/average-annotation-time/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_average_annotation_time" in response.data) {
      dailyAverageTime = response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item['average_annotation_time (seconds)'])
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      response.data['average_annotation_time (seconds)'],
      dailyAverageTime
    )
  }

  async fetchAllUsersAnnotationsCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount> {
    const url = `/report/member-progress-between-startdate-enddate/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersItemDoneCount(response.data.total)
  }

  async fetchAllUsersEveningQuestionnairesCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount> {
    const url = `/report/members-evening-questionnaire-progress/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersItemDoneCount(response.data.total)
  }

  async fetchAllUsersAverageTimeAnnotation(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-avg-daily-annotation-time/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      response.data['average_annotation_time (seconds)'],
      response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item['avg_annotation_time_daily (seconds)'])
      )
    )
  }

  async fetchAllUsersAverageTimeQuestionnaire(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-avg-daily-questionnaire-time/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      response.data['average_daily_questionnaire_time (seconds)'],
      response.data.daily_questionnaire_time.map((item: any) => 
        new DailyAverageTime(item.date, item['avg_questionnaire_time_daily (seconds)'])
      )
    )
  }

  async fetchAllUsersAverageTimeText(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-average-annotation-time/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      response.data['average_annotation_time (seconds)'],
      response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item['avg_annotation_time_single_text (seconds)'])
      )
    )
  }
}
