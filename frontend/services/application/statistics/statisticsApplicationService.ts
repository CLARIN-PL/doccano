import { StatisticsRepository } from '~/domain/models/statistics/statisticsRepository'
import {
  UserItemDoneCount, AllUsersItemDoneCount,
  UserAverageTime, AllUsersAverageTime
} from '~/domain/models/statistics/statistics'

export class StatisticsApplicationService {
  constructor(private readonly repository: StatisticsRepository) {}

  public async fetchUserAnnotationsCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount> {
    return await this.repository.fetchUserAnnotationsCount(userId, startDate, endDate)
  }

  public async fetchUserEveningQuestionnairesCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount> {
    return await this.repository.fetchUserEveningQuestionnairesCount(userId, startDate, endDate)
  }

  public async fetchUserAverageTimeAnnotation(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    return await this.repository.fetchUserAverageTimeAnnotation(userId, startDate, endDate)
  }

  public async fetchUserAverageTimeQuestionnaire(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    return await this.repository.fetchUserAverageTimeQuestionnaire(userId, startDate, endDate)
  }

  public async fetchUserAverageTimeText(userId: string, startDate: string, endDate: string): Promise<UserAverageTime> {
    return await this.repository.fetchUserAverageTimeText(userId, startDate, endDate)
  }

  public async fetchAllUsersAnnotationsCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount> {
    return await this.repository.fetchAllUsersAnnotationsCount(startDate, endDate)
  }

  public async fetchAllUsersEveningQuestionnairesCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount> {
    return await this.repository.fetchAllUsersEveningQuestionnairesCount(startDate, endDate)
  }

  public async fetchAllUsersAverageTimeAnnotation(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    return await this.repository.fetchAllUsersAverageTimeAnnotation(startDate, endDate)
  }

  public async fetchAllUsersAverageTimeQuestionnaire(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    return await this.repository.fetchAllUsersAverageTimeQuestionnaire(startDate, endDate)
  }

  public async fetchAllUsersAverageTimeText(startDate: string, endDate: string): Promise<AllUsersAverageTime> {
    return await this.repository.fetchAllUsersAverageTimeText(startDate, endDate)
  }
}
