<template>
    <canvas ref="lineChartCanvas"></canvas>
  </template>
  
  <script>
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
  export default {
  props: {
    chartData: {
      type: Object,
      required: true
    },
    dayName: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.lineChartCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true
        }
      });
    }
  }
};
</script>
  