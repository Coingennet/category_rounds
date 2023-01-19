<template>
  <ChartWrapper :loading="loading">
    <TimeFrame
      class="absolute z-[1] top-[18px] right-[22px] text-white"
      :time-frames="timeFrames"
      v-model="timeFrame"
    />
    <HighChart
      id="funding-round-by-category"
      :options="options"
      height="585px"
      ref="highchart"
    />
  </ChartWrapper>
</template>
<script>
import ChartWrapper from "@/components/ChartWrapper.vue";
import HighChart from "@/components/HighChart.vue";
import TimeFrame from "@/components/TimeFrame.vue";
import { CATEGORIES, ROUNDS } from "@/constants";
import { getDateRangeByTimeFrame } from "@/ultis";
const OPTIONS = {
  chart: {
    type: "column",
    backgroundColor: "#2e2e33",
  },

  title: {
    text: "Category Ratio per Funding Round",
    align: "left",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "white",
      fontFamily: "Rubik",
    },
  },
  xAxis: {
    categories: ROUNDS.map((i) => i.value),
    labels: {
      style: {
        color: "rgb(156 163 175)",
      },
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: null,
    },
    labels: {
      style: {
        color: "rgb(156 163 175)",
      },
    },
    gridLineColor: "transparent",
  },

  tooltip: {
    headerFormat: "<b>{point.x}</b><br/>",
    pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
  },
  plotOptions: {
    column: {
      stacking: "normal",
    },
  },
  legend: {
    enabled: true,
    align: "center",
    verticalAlign: "top",
    itemStyle: {
      color: "#e0e0e0",
      fontWeight: "normal",
    },
  },
  series: [],
};
export default {
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  components: { ChartWrapper, HighChart, TimeFrame },
  data() {
    return {
      timeFrame: "all",
      timeFrames: ["6m", "1y", "2y", "YTD", "All"],
    };
  },
  methods: {},
  computed: {
    series() {
      if (!this.data.length) return [];
      const rounds = ROUNDS.map((i) => i.value);
      const series = [];
      const range = getDateRangeByTimeFrame(this.timeFrame);
      const filteredByDateRangeData = this.data.filter((i) => {
        const date = i.date * 1000;
        return date >= range[0] && date <= range[1];
      });

      const categories = CATEGORIES.map((c) => c.values).flat();
      const others = filteredByDateRangeData.filter((i) => {
        return i.category && !categories.includes(i.category);
      });
      const invalidData = filteredByDateRangeData.filter((i) => {
        return (
          (!i.category && !i.sector) ||
          (i.sector &&
            !i.category &&
            !categories.some((v) =>
              i.sector.toLowerCase().includes(v.toLowerCase())
            ))
        );
      });
      const ids = others
        .map((i) => i._id)
        .concat(invalidData.map((i) => i._id));
      const validData = filteredByDateRangeData.filter(
        (i) => !ids.includes(i._id)
      );
      for (const category of CATEGORIES) {
        const data = [];
        for (const round of rounds) {
          data.push(
            validData
              .filter((i) => {
                return i.round === round;
              })
              .filter((i) => {
                if (i.category) {
                  if (category.values.includes(i.category)) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  if (
                    i.sector &&
                    category.values.some((v) =>
                      i.sector.toLowerCase().includes(v.toLowerCase())
                    )
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }).length
          );
        }
        series.push({
          name: category.name,
          data,
          color: category.color,
          borderWidth: 0,
        });
      }
      return series;
    },
    options() {
      return {
        ...OPTIONS,
        series: this.series,
      };
    },
  },
};
</script>
