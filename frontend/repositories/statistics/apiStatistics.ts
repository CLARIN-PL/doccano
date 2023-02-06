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
        new DailyAverageTime(item.date, (item['average_annotation_time (seconds)'] / 60))
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      (response.data['average_annotation_time (seconds)'] / 60),
      dailyAverageTime
    )
  }

  async fetchUserAverageTimeQuestionnaire(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/avg-daily-questionnaire-time/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_questionnaire_time" in response.data) {
      dailyAverageTime = response.data.daily_questionnaire_time.map((item: any) => 
        new DailyAverageTime(item.date, (item['total_time (seconds)'] / 60))
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      (response.data['average_daily_questionnaire_time (seconds)'] / 60),
      dailyAverageTime
    )
  }

  async fetchUserAverageTimeText(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/average-annotation-time/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_average_annotation_time" in response.data) {
      dailyAverageTime = response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, (item['average_annotation_time (seconds)'] / 60))
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      (response.data['average_annotation_time (seconds)'] / 60),
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
      (response.data['average_annotation_time (seconds)'] / 60),
      response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, (item['avg_annotation_time_daily (seconds)'] / 60))
      )
    )
  }

  async fetchAllUsersAverageTimeQuestionnaire(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-avg-daily-questionnaire-time/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      (response.data['average_daily_questionnaire_time (seconds)'] / 60),
      response.data.daily_questionnaire_time.map((item: any) => 
        new DailyAverageTime(item.date, (item['avg_questionnaire_time_daily (seconds)'] / 60))
      )
    )
  }

  async fetchAllUsersAverageTimeText(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-average-annotation-time/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      (response.data['average_annotation_time (seconds)'] / 60),
      response.data.daily_average_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, (item['avg_annotation_time_single_text (seconds)'] / 60))
      )
    )
  }

  async fetchUsrAvgTimeAnnotationActiveMinutes(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/user-daily-avg-active-minutes/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_active_annotation_time" in response.data) {
      dailyAverageTime = response.data.daily_active_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item.total_active_minutes)
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      response.data['average_daily_active_annotation_time (minutes)'],
      dailyAverageTime
    )
  }

  async fetchUsrAvgTimeQuestionnaireActiveMinutes(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/user-questionnaire-active-minutes/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_questionnaire_mins" in response.data) {
      dailyAverageTime = response.data.daily_questionnaire_mins.map((item: any) => 
        new DailyAverageTime(item.date, item.total_active_mins)
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      response.data.avg_questionnaire_active_mins,
      dailyAverageTime
    )
  }

  async fetchUsrAvgTimeTextActiveMinutes(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    const url = `/report/user-avg-single-text-active-minutes/${userId}/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    let dailyAverageTime = []
    if ("daily_avg_sinlge_text_annotation_time (active minutes)" in response.data) {
      dailyAverageTime = response.data['daily_avg_sinlge_text_annotation_time (active minutes)'].map((item: any) => 
        new DailyAverageTime(item.date, item['avg_active_annotation_time_daily (minutes)'])
      )
    }
    return new UserAverageTime(
      parseInt(userId),
      (typeof response.data['average_single_text_annotation_time (active minutes)'] === 'number') ? response.data['average_single_text_annotation_time (active minutes)'] : 0,
      dailyAverageTime
    )
  }

  async fetchAllUsersAvgTimeAnnotationActiveMinutes(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-avg-active-minutes/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      response.data['average_daily_active_annotation_time (minutes)'],
      response.data.daily_active_annotation_time.map((item: any) => 
        new DailyAverageTime(item.date, item['avg_active_annotation_time_daily (minutes)'])
      )
    )
  }

  async fetchAllUsersAvgTimeQuestionnaireActiveMinutes(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-questionnaire-active-minutes/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      response.data.all_user_avg_questionnaire_active_mins,
      response.data.daily_avg_questionnaire_active_mins.map((item: any) => 
        new DailyAverageTime(item.date, item.avg_daily_questionnaire_active_mins)
      )
    )
  }

  async fetchAllUsersAvgTimeTextActiveMinutes(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    const url = `/report/all-users-avg-single-text-active-minutes/${startDate}/${endDate}/`
    const response = await this.request.get(url)
    return new AllUsersAverageTime(
      (typeof response.data['all_user_avg_single_text_ann_time (active minutes)'] === 'number') ? response.data['all_user_avg_single_text_ann_time (active minutes)'] : 0,
      response.data['daily_avg_single_text_ann_time (active minutes)'].map((item: any) => 
        new DailyAverageTime(item.date, item['avg_single_text_ann_time_per_day (active minutes)'])
      )
    )
  }
}
