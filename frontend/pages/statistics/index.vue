<template>
  <v-row align="center" justify="center">
    <v-col cols="10" class="mt-10">
      <v-card class="mb-2 pa-5">
        <v-card-title class="mb-3">
          <h3>{{ $t('statistics.weeklyStats.aggregated.title') }}</h3>
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="center" class="mb-3">
            <v-col cols="12">
              <v-select
                :items="weeks"
                :label="$t('statistics.weeklyStats.weekSelectPrompt')"
                outlined
                @change="weekChangeHandler"
              ></v-select>
            </v-col>
            <v-col cols="12" class="bordered">
              <p>{{ $t('statistics.weeklyStats.startDate') + weekStartDate }}</p>
              <p>{{ $t('statistics.weeklyStats.endDate') + weekEndDate }}</p>
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.totalAnnotations')"
                :value="weeklyAggregatedStats.totalAnnotationsCount"
                :show-decimal="false"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.totalEveningQuestionnaires')"
                :value="weeklyAggregatedStats.totalEveningQuestionnairesCount"
                :show-decimal="false"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.avgTimeAnnotate')"
                :value="weeklyAggregatedStats.meanAvgTimeAnnotate"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyAggregatedStats.avgTimeAnnotate"
                :chart-data="weeklyAggregatedStats.avgTimeAnnotate"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.avgTimeQuestionnaire')"
                :value="weeklyAggregatedStats.meanAvgTimeQuestionnaire"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyAggregatedStats.avgTimeQuestionnaire"
                :chart-data="weeklyAggregatedStats.avgTimeQuestionnaire"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.aggregated.avgTimeText')"
                :value="weeklyAggregatedStats.meanAvgTimeText"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyAggregatedStats.avgTimeText"
                :chart-data="weeklyAggregatedStats.avgTimeText"
              />
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
          />
          <v-row align="center" justify="center" class="mb-3">
            <v-col cols="12" class="bordered">
              <p>{{ $t('statistics.weeklyStats.startDate') + weekStartDate }}</p>
              <p>{{ $t('statistics.weeklyStats.endDate') + weekEndDate }}</p>
              <p>{{ $t('statistics.weeklyStats.selectedUsername') + selectedUsername }}</p>
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.totalAnnotations')"
                :value="weeklyIndividualStats.totalAnnotationsCount"
                :show-decimal="false"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.totalEveningQuestionnaires')"
                :value="weeklyIndividualStats.totalEveningQuestionnairesCount"
                :show-decimal="false"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.avgTimeAnnotate')"
                :value="weeklyIndividualStats.meanAvgTimeAnnotate"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyIndividualStats.avgTimeAnnotate"
                :chart-data="weeklyIndividualStats.avgTimeAnnotate"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.avgTimeQuestionnaire')"
                :value="weeklyIndividualStats.meanAvgTimeQuestionnaire"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyIndividualStats.avgTimeQuestionnaire"
                :chart-data="weeklyIndividualStats.avgTimeQuestionnaire"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="$t('statistics.weeklyStats.individual.avgTimeText')"
                :value="weeklyIndividualStats.meanAvgTimeText"
                :show-decimal="true"
              />
              <bar-chart
                :key="chartKeys.weeklyIndividualStats.avgTimeText"
                :chart-data="weeklyIndividualStats.avgTimeText"
              />
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
      if (this.user !== null) {
        const user = this.user! as UserDTO
        return user.username
      }
      return ''
    }
  },

  watch: {
    username() {
      // Items have already been loaded
      if (this.users.length > 0) return
      // Items have already been requested
      if (this.isLoadingUserList) return
      this.$fetch()
    },
    async user(val) {
      await this.fetchIndividualWeekStatistics(val)
    }
  },

  created() {
    if (!this.isStaff()) {
      this.$router.push(this.localePath('/projects/'))
    }
  },

  async mounted() {
    this.week = this.weeks[0]
    this.setWeekStartAndWeekEnd()
    await this.fetchAggregatedWeekStatistics()
  },

  methods: {
    ...mapGetters('auth', ['isStaff']),

    setWeekStartAndWeekEnd() {
      const weekRange = this.week.split(" - ")
      this.weekStartDate = weekRange[0]
      this.weekEndDate = weekRange[1]
    },

    async weekChangeHandler(week: string) {
      this.week = week
      this.setWeekStartAndWeekEnd()
      await this.fetchAggregatedWeekStatistics()
      if (this.user !== null){
        await this.fetchIndividualWeekStatistics(this.user!)
      }
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
      const sun = items.filter((item) => moment(item.date, this.dateFormatAPI).day() === 7)

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
      const weekEndDateAPI = moment(this.weekEndDate, this.dateFormatUI).format(this.dateFormatAPI)

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

    async fetchIndividualWeekStatistics(user: UserDTO) {
      this.isLoadingChartData = true
      const userId = user.id.toString()
      const weekStartDate = moment(this.weekStartDate, this.dateFormatUI).format(this.dateFormatAPI)
      const weekEndDate = moment(this.weekEndDate, this.dateFormatUI).format(this.dateFormatAPI)

      const fetchUserAnnoCount = await this.$services.statistics.fetchUserAnnotationsCount(userId, weekStartDate, weekEndDate)
      const fetchUserEveQuestCount = await this.$services.statistics.fetchUserEveningQuestionnairesCount(userId, weekStartDate, weekEndDate)
      const fetchUserAvgAnnotation = await this.$services.statistics.fetchUserAverageTimeAnnotation(userId, weekStartDate, weekEndDate)
      const fetchUserAvgQuestionnaire = await this.$services.statistics.fetchUserAverageTimeQuestionnaire(userId, weekStartDate, weekEndDate)
      const fetchUserAvgText = await this.$services.statistics.fetchUserAverageTimeText(userId, weekStartDate, weekEndDate)
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

      this.chartKeys.weeklyIndividualStats.avgTimeAnnotate += 1
      this.chartKeys.weeklyIndividualStats.avgTimeQuestionnaire += 1
      this.chartKeys.weeklyIndividualStats.avgTimeText += 1
      this.isLoadingChartData = false
    }
  }
})
</script>

<style lang="scss">
.bordered {
  border: 1px solid black;
}

.loading-anim {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  text-align: center;
  padding-top: 70px;
}
</style>
