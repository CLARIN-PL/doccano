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
              <bar-chart :chart-data="chartData" />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time users spend daily with questionnaires (hour):'"
                :value="3.4"
              />
              <bar-chart :chart-data="chartData" />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time users spend to annotate a single text (minute):'"
                :value="3.4"
              />
              <bar-chart :chart-data="chartData" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mb-2 pa-5">
        <v-card-title class="mb-3">
          Weekly Statistics for Individual User
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="center" class="mb-3">
            <v-col cols="12">
              <v-select
                :items="['annotator1', 'annotator2']"
                label="-- Select a user --"
                outlined
              ></v-select>
            </v-col>
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
              <bar-chart :chart-data="chartData" />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time the user spends daily with questionnaires (hour):'"
                :value="3.4"
              />
              <bar-chart :chart-data="chartData" />
            </v-col>
            <v-col cols="6" class="bordered">
              <big-number-card
                :label="'Average time the user spends to annotate a single text (minute):'"
                :value="3.4"
              />
              <bar-chart :chart-data="chartData" />
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
import BigNumberCard from '@/components/utils/BigNumberCard.vue'
import BarChart from '@/components/metrics/ChartBar.vue'

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
      weeks: [
        '12 December 2022 - 18 December 2022',
        '19 December 2022 - 25 December 2022'
      ],
      chartData: {
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
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

  created() {
    if (!this.isStaff()) {
      this.$router.push(this.localePath('/projects/'))
    }
  },

  methods: {
    ...mapGetters('auth', ['isStaff'])
  }
})
</script>

<style lang="scss">
.bordered {
  border: 1px solid black;
}
</style>
