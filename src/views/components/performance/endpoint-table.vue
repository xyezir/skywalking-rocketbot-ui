<template>
  <rk-table :data="data" :columns="columns" bordered :scroll="{ x: 2400 }"></rk-table>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import moment from 'dayjs';

  import { Option } from '@/types/global';
  import performance, { DateMode, IndName } from '../../../store/modules/performance';
  import RkTable from '../../../components/rk-table.vue';

  @Component({
    components: {
      RkTable,
    },
  })
  export default class EndpointTable extends Vue {
    @Prop() public performances!: any[];

    private columns: any[] = [
      {
        key: 'name',
        title: 'name',
        width: 500,
        ellipsis: true,
        sorter: true,
      },
      {
        key: 'timeBucket',
        title: 'time',
        width: 120,
      },
      {
        key: 'percentage',
        title: 'SLA(%)',
        width: 140,
        sorter: true,
      },
      {
        key: 'total',
        title: 'total',
        width: 120,
        sorter: true,
      },
      {
        key: 'fail',
        title: 'fail',
        width: 120,
        sorter: true,
      },
      {
        key: 'cpm',
        title: 'cpm',
        width: 100,
        sorter: true,
      },
      {
        key: 'max',
        title: 'max(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'min',
        title: 'min(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'avg',
        title: 'avg(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'p50',
        title: 'p50(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'p75',
        title: 'p75(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'p90',
        title: 'p90(ms)',
        width: 100,
        sorter: true,
      },
      {
        key: 'p99',
        title: 'p99(ms)',
        width: 100,
        sorter: true,
      },
    ];

    private data: any[] = this.performances.map((pfm: any) => {
      pfm.fail = pfm.total - pfm.match;
      pfm.percentage = (pfm.percentage / 100).toFixed(2);
      return pfm;
    });
  }
</script>
