<template>
  <v-row align="center" justify="center">
    <v-col lg="10" md="12" class="mt-10">
      <v-card class="mb-2 pa-5">
        <v-card-title class="mb-3">
          <h3>{{ $t('statistics.weeklyStats.aggregated.title') }}</h3>
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="center" class="report mb-3">
            <v-col cols="12">
              <v-select
                :items="weeks"
                :label="$t('statistics.weeklyStats.weekSelectPrompt')"
                outlined
                @change="weekChangeHandler"
              ></v-select>
            </v-col>
            <v-col cols="12" class="report-item">
              <p>{{ $t('statistics.weeklyStats.startDate') + weekStartDate }}</p>
              <p>{{ $t('statistics.weeklyStats.endDate') + weekEndDate }}</p>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.totalAnnotations')"
                :value="weeklyAggregatedStats.totalAnnotationsCount"
                :show-decimal="false"
                class="flex-grow-1"
              />
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.totalEveningQuestionnaires')"
                :value="weeklyAggregatedStats.totalEveningQuestionnairesCount"
                :show-decimal="false"
                class="flex-grow-1"
              />
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.aggregated.avgTimeAnnotate')"
                  :value="weeklyAggregatedStats.meanAvgTimeAnnotate"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyAggregatedStats.avgTimeAnnotate"
                  :chart-data="weeklyAggregatedStats.avgTimeAnnotate"
                />
              </div>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.aggregated.avgTimeQuestionnaire')"
                  :value="weeklyAggregatedStats.meanAvgTimeQuestionnaire"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyAggregatedStats.avgTimeQuestionnaire"
                  :chart-data="weeklyAggregatedStats.avgTimeQuestionnaire"
                />
              </div>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.aggregated.avgTimeText')"
                  :value="weeklyAggregatedStats.meanAvgTimeText"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyAggregatedStats.avgTimeText"
                  :chart-data="weeklyAggregatedStats.avgTimeText"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mb-2 pa-5">
        <v-card-title class="mb-3">
          <h3>{{ $t('statistics.weeklyStats.individual.title') }}</h3>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="user"
            :items="users"
            :loading="isLoadingUserList"
            :search-input.sync="username"
            hide-no-data
            item-text="username"
            :label="$t('members.userSearchAPIs')"
            :placeholder="$t('members.userSearchPrompt')"
            :prepend-icon="mdiAccount"
            :rules="[rules.userRequired]"
            :error="error"
            return-object
            @change="userChangeHandler"
          />
          <v-row align="center" justify="center" class="report mb-3">
            <v-col cols="12" class="report-item">
              <p>{{ $t('statistics.weeklyStats.startDate') + weekStartDate }}</p>
              <p>{{ $t('statistics.weeklyStats.endDate') + weekEndDate }}</p>
              <p>{{ $t('statistics.weeklyStats.selectedUsername') + selectedUsername }}</p>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.totalAnnotations')"
                :value="weeklyIndividualStats.totalAnnotationsCount"
                :show-decimal="false"
                class="flex-grow-1"
              />
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.totalEveningQuestionnaires')"
                :value="weeklyIndividualStats.totalEveningQuestionnairesCount"
                :show-decimal="false"
                class="flex-grow-1"
              />
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.individual.avgTimeAnnotate')"
                  :value="weeklyIndividualStats.meanAvgTimeAnnotate"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyIndividualStats.avgTimeAnnotate"
                  :chart-data="weeklyIndividualStats.avgTimeAnnotate"
                />
              </div>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.individual.avgTimeQuestionnaire')"
                  :value="weeklyIndividualStats.meanAvgTimeQuestionnaire"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyIndividualStats.avgTimeQuestionnaire"
                  :chart-data="weeklyIndividualStats.avgTimeQuestionnaire"
                />
              </div>
            </v-col>
            <v-col lg="6" md="12" class="report-item d-flex">
              <div class="flex-grow-1">
                <big-number-card
                  :label="$t('statistics.weeklyStats.individual.avgTimeText')"
                  :value="weeklyIndividualStats.meanAvgTimeText"
                  :show-decimal="true"
                />
                <bar-chart
                  :key="chartKeys.weeklyIndividualStats.avgTimeText"
                  :chart-data="weeklyIndividualStats.avgTimeText"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <div v-show="isLoadingChartData" class="loading-anim">
      <p>{{ $t('generic.loading') }}</p>
      <v-progress-circular
        :size="90"
        color="primary"
        indeterminate
      />
    </div>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { mdiAccount } from '@mdi/js'
import BigNumberCard from '@/components/utils/BigNumberCard.vue'
import BarChart from '@/components/metrics/ChartBar.vue'
import { UserDTO } from '~/services/application/user/userData'
import { DailyAverageTime } from '~/domain/models/statistics/statistics'

export default Vue.extend({
  name: 'Statistics',
  components: {
    BigNumberCard,
    BarChart
  },
  layout: 'statistics',
  middleware: ['check-auth', 'auth'],

  data() {
    return {
      mdiAccount,
      isLoadingUserList: false,
      isLoadingChartData: false,
      error: false,
      researchStartDate: '2022-12-01',
      dateFormatAPI: 'YYYY-MM-DD',
      dateFormatUI: 'ddd, DD MMM YYYY',
      week: '',
      weekStartDate: '',
      weekEndDate: '',
      users: [] as UserDTO[],
      user: null,
      username: '',
      rules: {
        userRequired: (v: UserDTO) => (!!v && !!v.username) || 'Required'
      },
      weeklyAggregatedStats: {
        totalAnnotationsCount: 0,
        totalEveningQuestionnairesCount: 0,
        meanAvgTimeAnnotate: 0,
        avgTimeAnnotate: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        },
        meanAvgTimeQuestionnaire: 0,
        avgTimeQuestionnaire: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        },
        meanAvgTimeText: 0,
        avgTimeText: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        }
      },
      weeklyIndividualStats: {
        totalAnnotationsCount: 0,
        totalEveningQuestionnairesCount: 0,
        meanAvgTimeAnnotate: 0,
        avgTimeAnnotate: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        },
        meanAvgTimeQuestionnaire: 0,
        avgTimeQuestionnaire: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        },
        meanAvgTimeText: 0,
        avgTimeText: {
          labels: [] as string[],
          datasets: [
            {
              label: 'Chart',
              backgroundColor: '#f87979',
              data: [] as number[]
            }
          ]
        }
      },
      chartKeys: {
        weeklyAggregatedStats: {
          avgTimeAnnotate: 0,
          avgTimeQuestionnaire: 0,
          avgTimeText: 0
        },
        weeklyIndividualStats: {
          avgTimeAnnotate: 0,
          avgTimeQuestionnaire: 0,
          avgTimeText: 0
        }
      }
    }
  },

  async fetch() {
    this.isLoadingUserList = true
    this.users = await this.$services.user.list(this.username)
    this.isLoadingUserList = false
  },

  computed: {
    ...mapGetters('auth', ['isStaff']),
    weeks() {
      const startPeriod = moment(this.researchStartDate)
      const endPeriod = moment()
      const weeks = []
      let newStartPeriod = startPeriod
      let lastDateOfWeek = null
      let week = ""
      if (startPeriod.day() !== 1) {
        const dayPluses = 7 - startPeriod.day()
        lastDateOfWeek = startPeriod.clone().add(dayPluses, 'days')
        week = startPeriod.format(this.dateFormatUI) + " - " + lastDateOfWeek.format(this.dateFormatUI)
        weeks.unshift(week)
        newStartPeriod = lastDateOfWeek.clone().add(1, 'days')
      }
      while (!newStartPeriod.isAfter(endPeriod)) {
        lastDateOfWeek = newStartPeriod.clone().add(6, 'days')
        week = newStartPeriod.format(this.dateFormatUI) + " - " + lastDateOfWeek.format(this.dateFormatUI)
        weeks.unshift(week)
        newStartPeriod = lastDateOfWeek.clone().add(1, 'days')
      }
      return weeks
    },
    selectedUsername() {
      const user = this.user as UserDTO | null
      return (user === null) ? '' : user.username
    }
  },

  watch: {
    username() {
      // Items have already been loaded
      if (this.users.length > 0) return
      // Items have already been requested
      if (this.isLoadingUserList) return
      this.$fetch()
    }
  },

  created() {
    if (!this.isStaff) {
      this.$router.push(this.localePath('/projects/'))
    }
  },

  async mounted() {
    this.week = this.weeks[0]
    this.setWeekStartAndWeekEnd()
    await this.fetchAggregatedWeekStatistics()
  },

  methods: {
    async userChangeHandler(val: UserDTO) {
      await this.fetchIndividualWeekStatistics(val)
    },

    setWeekStartAndWeekEnd() {
      const weekRange = this.week.split(" - ")
      this.weekStartDate = weekRange[0]
      this.weekEndDate = weekRange[1]
    },

    async weekChangeHandler(week: string) {
      this.week = week
      this.setWeekStartAndWeekEnd()
      await this.fetchAggregatedWeekStatistics()
      await this.fetchIndividualWeekStatistics(this.user)
    },

    getChartData(items: DailyAverageTime[], unit: string) {
      const avgTimeDivisor = (unit === "minute") ? 60 : 3600
      const output = {
        labels: [] as string[],
        values: [] as number[]
      }

      const mon = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 1)
      const tue = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 2)
      const wed = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 3)
      const thu = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 4)
      const fri = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 5)
      const sat = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 6)
      const sun = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 0)

      output.labels.push((mon.length > 0) ? moment(mon[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Monday')
      output.labels.push((tue.length > 0) ? moment(tue[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Tuesday')
      output.labels.push((wed.length > 0) ? moment(wed[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Wednesday')
      output.labels.push((thu.length > 0) ? moment(thu[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Thursday')
      output.labels.push((fri.length > 0) ? moment(fri[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Friday')
      output.labels.push((sat.length > 0) ? moment(sat[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Saturday')
      output.labels.push((sun.length > 0) ? moment(sun[0].date, this.dateFormatAPI).format(this.dateFormatUI) : 'Sunday')

      output.values.push((mon.length > 0) ? mon[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((tue.length > 0) ? tue[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((wed.length > 0) ? wed[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((thu.length > 0) ? thu[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((fri.length > 0) ? fri[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((sat.length > 0) ? sat[0].averageTimeInSeconds/avgTimeDivisor : 0)
      output.values.push((sun.length > 0) ? sun[0].averageTimeInSeconds/avgTimeDivisor : 0)

      return output
    },

    async fetchAggregatedWeekStatistics() {
      this.isLoadingChartData = true
      const weekStartDateAPI = moment(this.weekStartDate, this.dateFormatUI).format(this.dateFormatAPI)
      const weekEndDateAPI = moment(this.weekEndDate, this.dateFormatUI).add(1, 'days').format(this.dateFormatAPI)

      const fetchAllAnnoCount = await this.$services.statistics.fetchAllUsersAnnotationsCount(weekStartDateAPI, weekEndDateAPI)
      const fetchAllEveQuestCount = await this.$services.statistics.fetchAllUsersEveningQuestionnairesCount(weekStartDateAPI, weekEndDateAPI)
      const fetchAllAvgAnnotation = await this.$services.statistics.fetchAllUsersAverageTimeAnnotation(weekStartDateAPI, weekEndDateAPI)
      const fetchAllAvgQuestionnaire = await this.$services.statistics.fetchAllUsersAverageTimeQuestionnaire(weekStartDateAPI, weekEndDateAPI)
      const fetchAllAvgText = await this.$services.statistics.fetchAllUsersAverageTimeText(weekStartDateAPI, weekEndDateAPI)
      const allAvgAnnotationChartData = this.getChartData(fetchAllAvgAnnotation.dailyAverageTime, 'hour')
      const allAvgQuestionnaireChartData = this.getChartData(fetchAllAvgQuestionnaire.dailyAverageTime, 'hour')
      const allAvgTextChartData = this.getChartData(fetchAllAvgText.dailyAverageTime, 'minute')

      this.weeklyAggregatedStats.totalAnnotationsCount = fetchAllAnnoCount.total
      this.weeklyAggregatedStats.totalEveningQuestionnairesCount = fetchAllEveQuestCount.total
      this.weeklyAggregatedStats.meanAvgTimeAnnotate = fetchAllAvgAnnotation.meanTimeInSeconds / 3600
      this.weeklyAggregatedStats.avgTimeAnnotate.labels = allAvgAnnotationChartData.labels
      this.weeklyAggregatedStats.avgTimeAnnotate.datasets[0].data = allAvgAnnotationChartData.values
      this.weeklyAggregatedStats.meanAvgTimeQuestionnaire = fetchAllAvgQuestionnaire.meanTimeInSeconds / 3600
      this.weeklyAggregatedStats.avgTimeQuestionnaire.labels = allAvgQuestionnaireChartData.labels
      this.weeklyAggregatedStats.avgTimeQuestionnaire.datasets[0].data = allAvgQuestionnaireChartData.values
      this.weeklyAggregatedStats.meanAvgTimeText = fetchAllAvgText.meanTimeInSeconds / 60
      this.weeklyAggregatedStats.avgTimeText.labels = allAvgTextChartData.labels
      this.weeklyAggregatedStats.avgTimeText.datasets[0].data = allAvgTextChartData.values

      this.chartKeys.weeklyAggregatedStats.avgTimeAnnotate += 1
      this.chartKeys.weeklyAggregatedStats.avgTimeQuestionnaire += 1
      this.chartKeys.weeklyAggregatedStats.avgTimeText += 1
      this.isLoadingChartData = false
    },

    async fetchIndividualWeekStatistics(user: UserDTO | null) {
      this.isLoadingChartData = true
      if (user === null) {
        this.weeklyIndividualStats.totalAnnotationsCount = 0
        this.weeklyIndividualStats.totalEveningQuestionnairesCount = 0
        this.weeklyIndividualStats.meanAvgTimeAnnotate = 0
        this.weeklyIndividualStats.avgTimeAnnotate.labels = []
        this.weeklyIndividualStats.avgTimeAnnotate.datasets[0].data = []
        this.weeklyIndividualStats.meanAvgTimeQuestionnaire = 0
        this.weeklyIndividualStats.avgTimeQuestionnaire.labels = []
        this.weeklyIndividualStats.avgTimeQuestionnaire.datasets[0].data = []
        this.weeklyIndividualStats.meanAvgTimeText = 0
        this.weeklyIndividualStats.avgTimeText.labels = []
        this.weeklyIndividualStats.avgTimeText.datasets[0].data = []
      } else {
        const userId = user.id.toString()
        const weekStartDateAPI = moment(this.weekStartDate, this.dateFormatUI).format(this.dateFormatAPI)
        const weekEndDateAPI = moment(this.weekEndDate, this.dateFormatUI).add(1, 'days').format(this.dateFormatAPI)

        const fetchUserAnnoCount = await this.$services.statistics.fetchUserAnnotationsCount(userId, weekStartDateAPI, weekEndDateAPI)
        const fetchUserEveQuestCount = await this.$services.statistics.fetchUserEveningQuestionnairesCount(userId, weekStartDateAPI, weekEndDateAPI)
        const fetchUserAvgAnnotation = await this.$services.statistics.fetchUserAverageTimeAnnotation(userId, weekStartDateAPI, weekEndDateAPI)
        const fetchUserAvgQuestionnaire = await this.$services.statistics.fetchUserAverageTimeQuestionnaire(userId, weekStartDateAPI, weekEndDateAPI)
        const fetchUserAvgText = await this.$services.statistics.fetchUserAverageTimeText(userId, weekStartDateAPI, weekEndDateAPI)
        const userAvgAnnotationChartData = this.getChartData(fetchUserAvgAnnotation.dailyAverageTime, 'hour')
        const userAvgQuestionnaireChartData = this.getChartData(fetchUserAvgQuestionnaire.dailyAverageTime, 'hour')
        const userAvgTextChartData = this.getChartData(fetchUserAvgText.dailyAverageTime, 'minute')

        this.weeklyIndividualStats.totalAnnotationsCount = fetchUserAnnoCount.done
        this.weeklyIndividualStats.totalEveningQuestionnairesCount = fetchUserEveQuestCount.done
        this.weeklyIndividualStats.meanAvgTimeAnnotate = fetchUserAvgAnnotation.meanTimeInSeconds / 3600
        this.weeklyIndividualStats.avgTimeAnnotate.labels = userAvgAnnotationChartData.labels
        this.weeklyIndividualStats.avgTimeAnnotate.datasets[0].data = userAvgAnnotationChartData.values
        this.weeklyIndividualStats.meanAvgTimeQuestionnaire = fetchUserAvgQuestionnaire.meanTimeInSeconds / 3600
        this.weeklyIndividualStats.avgTimeQuestionnaire.labels = userAvgQuestionnaireChartData.labels
        this.weeklyIndividualStats.avgTimeQuestionnaire.datasets[0].data = userAvgQuestionnaireChartData.values
        this.weeklyIndividualStats.meanAvgTimeText = fetchUserAvgText.meanTimeInSeconds / 60
        this.weeklyIndividualStats.avgTimeText.labels = userAvgTextChartData.labels
        this.weeklyIndividualStats.avgTimeText.datasets[0].data = userAvgTextChartData.values
      }

      this.chartKeys.weeklyIndividualStats.avgTimeAnnotate += 1
      this.chartKeys.weeklyIndividualStats.avgTimeQuestionnaire += 1
      this.chartKeys.weeklyIndividualStats.avgTimeText += 1
      this.isLoadingChartData = false
    }
  }
})
</script>

<style lang="scss">
.report-item {
  flex-direction:column;
}

.loading-anim {
  position: fixed;
  z-index: 100;
  top: 55px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  text-align: center;
  padding-top: 70px;
}
</style>
