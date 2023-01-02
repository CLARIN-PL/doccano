<template>
  <v-row align="center" justify="center">
    <v-col cols="10" class="mt-10">
      <v-card class="mb-2 pa-5">
        <v-card-title class="mb-3">
          <h3>Weekly Statistics for All Users</h3>
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="center" class="mb-3">
            <v-col cols="12">
              <v-select
                :items="weeks"
                label="-- Select a week range --"
                outlined
                @change="fetchAggregatedWeekStatistics"
              ></v-select>
            </v-col>
            <v-col cols="12" class="bordered">
              <p>Start Date: 12 December 2022</p>
              <p>End Date: 18 December 2022</p>
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Total annotations made this week:'"
                :value="12324"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Total evening questionnaires made this week:'"
                :value="128"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time users spend daily with annotating (hour):'"
                :value="3.4"
              />
              <bar-chart
                :key="chartKeys.weeklyAggregatedStats.avgTimeAnnotate"
                :chart-data="weeklyAggregatedStats.avgTimeAnnotate"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time users spend daily with questionnaires (hour):'"
                :value="3.4"
              />
              <bar-chart
                :key="chartKeys.weeklyAggregatedStats.avgTimeQuestionnaire"
                :chart-data="weeklyAggregatedStats.avgTimeQuestionnaire"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time users spend to annotate a single text (minute):'"
                :value="3.4"
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
          Weekly Statistics for Individual User
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="user"
            :items="users"
            :loading="isLoading"
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
              <p>Start Date: 12 December 2022</p>
              <p>End Date: 18 December 2022</p>
              <p>User: Annotator2</p>
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Total annotations made by this user this week:'"
                :value="12324"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Total evening questionnaires made by this user this week:'"
                :value="128"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time the user spends daily with annotating (hour):'"
                :value="3.4"
              />
              <bar-chart
                :key="chartKeys.weeklyIndividualStats.avgTimeAnnotate"
                :chart-data="weeklyIndividualStats.avgTimeAnnotate"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time the user spends daily with questionnaires (hour):'"
                :value="3.4"
              />
              <bar-chart
                :key="chartKeys.weeklyIndividualStats.avgTimeQuestionnaire"
                :chart-data="weeklyIndividualStats.avgTimeQuestionnaire"
              />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time the user spends to annotate a single text (minute):'"
                :value="3.4"
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
      isLoading: false,
      error: false,
      week: '',
      users: [] as UserDTO[],
      user: null,
      username: '',
      rules: {
        userRequired: (v: UserDTO) => (!!v && !!v.username) || 'Required'
      },
      weeklyAggregatedStats: {
        avgTimeAnnotate: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [3.7, 3.6, 3.9, 4.1, 4.2, 2.1, 2.2]
            }
          ]
        },
        avgTimeQuestionnaire: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [3.7, 3.6, 3.9, 4.1, 4.2, 2.1, 2.2]
            }
          ]
        },
        avgTimeText: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [3.7, 3.6, 3.9, 4.1, 4.2, 2.1, 2.2]
            }
          ]
        }
      },
      weeklyIndividualStats: {
        avgTimeAnnotate: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [0, 0, 0, 0, 0, 0, 0]
            }
          ]
        },
        avgTimeQuestionnaire: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [0, 0, 0, 0, 0, 0, 0]
            }
          ]
        },
        avgTimeText: {
          labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          datasets: [
            {
              label: 'Sample Chart',
              backgroundColor: '#f87979',
              data: [0, 0, 0, 0, 0, 0, 0]
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
    this.isLoading = true
    this.users = await this.$services.user.list(this.username)
    // fetch data of current week
    this.isLoading = false
  },

  computed: {
    weeks() {
      const strDateFormat = 'ddd, DD/MM/YYYY'
      const startPeriod = moment('2022-12-01')
      const endPeriod = moment()
      const weeks = []
      let newStartPeriod = startPeriod
      let lastDateOfWeek = null
      let week = ""
      if (startPeriod.day() !== 1) {
        const dayPluses = 7 - startPeriod.day()
        lastDateOfWeek = startPeriod.clone().add(dayPluses, 'days')
        week = startPeriod.format(strDateFormat) + " - " + lastDateOfWeek.format(strDateFormat)
        weeks.unshift(week)
        newStartPeriod = lastDateOfWeek.clone().add(1, 'days')
      }
      while (!newStartPeriod.isAfter(endPeriod)) {
        lastDateOfWeek = newStartPeriod.clone().add(6, 'days')
        week = newStartPeriod.format(strDateFormat) + " - " + lastDateOfWeek.format(strDateFormat)
        weeks.unshift(week)
        newStartPeriod = lastDateOfWeek.clone().add(1, 'days')
      }
      return weeks
    }
  },

  watch: {
    username() {
      // Items have already been loaded
      if (this.users.length > 0) return
      // Items have already been requested
      if (this.isLoading) return
      this.$fetch()
    },
    user(val) {
      this.fetchIndividualWeekStatistics(this.week, val)
    }
  },

  created() {
    if (!this.isStaff()) {
      this.$router.push(this.localePath('/projects/'))
    }
  },

  methods: {
    ...mapGetters('auth', ['isStaff']),
    fetchAggregatedWeekStatistics(week: string) {
      console.log(week)
      this.week = week
      this.weeklyAggregatedStats.avgTimeAnnotate.datasets[0].data = [1, 3, 2, 5, 4, 7, 6]
      this.weeklyAggregatedStats.avgTimeQuestionnaire.datasets[0].data = [10, 20, 30, 40, 50, 60, 70]
      this.weeklyAggregatedStats.avgTimeText.datasets[0].data = [7, 6, 5, 4, 3, 2, 1]
      this.chartKeys.weeklyAggregatedStats.avgTimeAnnotate += 1
      this.chartKeys.weeklyAggregatedStats.avgTimeQuestionnaire += 1
      this.chartKeys.weeklyAggregatedStats.avgTimeText += 1
      if (this.user){
        console.log("run fetch for individual data")
        this.fetchIndividualWeekStatistics(this.week, this.user)
      }
    },
    fetchIndividualWeekStatistics(week: string, user: UserDTO) {
      console.log(week)
      console.log(user)
      if (this.chartKeys.weeklyIndividualStats.avgTimeAnnotate === 0) {
        this.weeklyIndividualStats.avgTimeAnnotate.datasets[0].data = [1, 2, 3, 4, 5, 6, 7]
        this.weeklyIndividualStats.avgTimeQuestionnaire.datasets[0].data = [10, 20, 30, 40, 50, 60, 70]
        this.weeklyIndividualStats.avgTimeText.datasets[0].data = [7, 6, 5, 4, 3, 2, 1]
      } else {
        this.weeklyIndividualStats.avgTimeAnnotate.datasets[0].data = [1, 5, 7, 9, 11, 13, 15]
        this.weeklyIndividualStats.avgTimeQuestionnaire.datasets[0].data = [16, 14, 12, 10, 8, 4, 2]
        this.weeklyIndividualStats.avgTimeText.datasets[0].data = [1, 2, 3, 4, 3, 2, 1]
      }
      this.chartKeys.weeklyIndividualStats.avgTimeAnnotate += 1
      this.chartKeys.weeklyIndividualStats.avgTimeQuestionnaire += 1
      this.chartKeys.weeklyIndividualStats.avgTimeText += 1
    }
  }
})
</script>

<style lang="scss">
.bordered {
  border: 1px solid black;
}
</style>
