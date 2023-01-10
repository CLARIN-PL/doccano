import {
  UserItemDoneCount, AllUsersItemDoneCount,
  UserAverageTime, AllUsersAverageTime
} from '~/domain/models/statistics/statistics'

export interface StatisticsRepository {
  fetchUserAnnotationsCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount>
  fetchUserEveningQuestionnairesCount(userId: string, startDate: string, endDate: string): Promise<UserItemDoneCount>
  fetchUserAverageTimeAnnotation(userId: string, startDate: string, endDate: string): Promise<UserAverageTime>
  fetchUserAverageTimeQuestionnaire(userId: string, startDate: string, endDate: string): Promise<UserAverageTime>
  fetchUserAverageTimeText(userId: string, startDate: string, endDate: string): Promise<UserAverageTime>
  fetchAllUsersAnnotationsCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount>
  fetchAllUsersEveningQuestionnairesCount(startDate: string, endDate: string): Promise<AllUsersItemDoneCount>
  fetchAllUsersAverageTimeAnnotation(startDate: string, endDate: string): Promise<AllUsersAverageTime>
  fetchAllUsersAverageTimeQuestionnaire(startDate: string, endDate: string): Promise<AllUsersAverageTime>
  fetchAllUsersAverageTimeText(startDate: string, endDate: string): Promise<AllUsersAverageTime>
}
