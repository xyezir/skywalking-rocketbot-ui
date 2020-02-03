<template>
  <div class="flex-v wrapper" style="flex-grow:1;height: 100%;">
    <div class="rk-performance-bar flex-v">
      <div class="ml-5 flex-h date-control">
        <span class="sm b grey mr-5">{{ this.$t('dateMode') }}:</span>
        <span class="ml-5 mr-5">
          <a
            class="rk-performance-group-i"
            @click="handleDateOption('DAY')"
            :class="{ active: currentDateMode === 'DAY', grey: currentDateMode !== 'DAY' }"
            >{{ this.$t('day') }}</a
          >
        </span>
        <span class="ml-5 mr-5">
          <a
            class="rk-performance-group-i"
            @click="handleDateOption('HOUR')"
            :class="{ active: currentDateMode === 'HOUR', grey: currentDateMode !== 'HOUR' }"
            >{{ this.$t('hour') }}</a
          >
        </span>
        <span class="ml-5 mr-5">
          <a
            class="rk-performance-group-i"
            @click="handleDateOption('MINUTE')"
            :class="{ active: currentDateMode === 'MINUTE', grey: currentDateMode !== 'MINUTE' }"
            >{{ this.$t('minute') }}</a
          >
        </span>
        <div>
          <span class="sm b grey mr-5">{{ this.$t('datePicker') }}:</span>
          <RkDate class="sm" v-model="time" position="bottom" :format="datePickerFormat" />
        </div>
      </div>
      <div class="rk-performance-date-more">
        <span v-for="(date, index) in subDate" :key="index" class="ml-5 mr-5">
          <a
            class="rk-performance-group-i"
            @click="handleSubDateOption(date)"
            :class="{ active: currentSubDate === date, grey: currentSubDate !== date }"
            >{{ date }}</a
          >
        </span>
      </div>
    </div>
    <div class="rk-performance-bar flex-h">
      <div class="rk-performance-bar-reload">
        <svg class="icon lg vm cp rk-btn ghost" @click="handleRefreshService">
          <use xlink:href="#retry" />
        </svg>
      </div>
      <ToolBarSelect
        @onChoose="selectService"
        :title="this.$t('currentService')"
        :current="service"
        :data="rocketPerformance.services"
        icon="package"
      />
      <span class="ml-5 mr-5">
        <a
          class="rk-performance-group-i"
          @click="handleGroupOption('service')"
          :class="{ active: currentIndName === 'service', grey: currentIndName !== 'service' }"
          >{{ this.$t('service') }}</a
        >
      </span>
      <span class="ml-5 mr-5" v-if="service.key !== ''">
        <a
          class="rk-performance-group-i"
          @click="handleGroupOption('service_instance')"
          :class="{ active: currentIndName === 'service_instance', grey: currentIndName !== 'service_instance' }"
          >{{ this.$t('instance') }}</a
        >
      </span>
      <span class="ml-5 mr-5" v-if="service.key !== ''">
        <a
          class="rk-performance-group-i"
          @click="handleGroupOption('endpoint')"
          :class="{ active: currentIndName === 'endpoint', grey: currentIndName !== 'endpoint' }"
          >{{ this.$t('endpoint') }}</a
        >
      </span>
    </div>
    <div class="performance-container clear" v-if="!isLoading">
      <service-table v-if="currentIndName === 'service'" :performances="rocketPerformance.performances"></service-table>
      <instance-table
        v-if="currentIndName === 'service_instance'"
        :performances="rocketPerformance.performances"
      ></instance-table>
      <endpoint-table
        v-if="currentIndName === 'endpoint'"
        :performances="rocketPerformance.performances"
      ></endpoint-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import moment from 'dayjs';

  import { Option } from '@/types/global';
  import performance, { DateMode, IndName } from '../../store/modules/performance';
  import ToolBarSelect from '../components/performance/tool-bar-select.vue';
  import ServiceTable from '../components/performance/service-table.vue';
  import InstanceTable from '../components/performance/instance-table.vue';
  import EndpointTable from '../components/performance/endpoint-table.vue';

  @Component({
    components: {
      ServiceTable,
      InstanceTable,
      EndpointTable,
      ToolBarSelect,
    },
  })
  export default class Performance extends Vue {
    @State('rocketPerformance') private rocketPerformance: any;
    @Action('rocketPerformance/GET_SERVICES') private GET_SERVICES: any;
    @Action('rocketPerformance/GET_PERFORMANCE') private GET_PERFORMANCE: any;
    @Getter('durationTime') private durationTime: any;

    private service: Option = { label: 'All', key: '' };
    private currentIndName: IndName = IndName.SERVICE;
    private currentDateMode: DateMode = DateMode.DAY;
    private currentSubDate: string = moment().format('DD');
    private datePickerFormat: string = 'YYYYMM';
    private isRouterAlive: boolean = true;
    private time!: Date;
    private isLoading: boolean = true;

    get subDate(): any[] {
      const dates: string[] = [];
      switch (this.currentDateMode) {
        case DateMode.DAY:
          const dayNumber = moment().daysInMonth();
          for (let i = 1; i <= dayNumber; i++) {
            dates.push(i < 10 ? `0${i}` : `${i}`);
          }
          break;
        case DateMode.HOUR:
          for (let i = 0; i < 24; i++) {
            dates.push(i < 10 ? `0${i}` : `${i}`);
          }
          break;
        case DateMode.MINUTE:
          for (let i = 0; i < 60; i++) {
            dates.push(i < 10 ? `0${i}` : `${i}`);
          }
          break;
      }
      return dates;
    }

    public tableSortChange(params: any) {
      let field: string;
      let orderBy: string;
      const keys = Object.keys(params);
      for (let i = 0, len = keys.length; i < len; i++) {
        if (params[keys[i]] !== '') {
          field = keys[i];
          orderBy = params[keys[i]];
        }
      }
      this.rocketPerformance.performances.sort((a: any, b: any) => {
        if (orderBy === 'asc') {
          return a[field] - b[field];
        } else if (orderBy === 'desc') {
          return b[field] - a[field];
        } else {
          return 0;
        }
      });
    }

    public reload(): void {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }

    private selectService(service: any) {
      if (service.key === '') {
        this.currentIndName = IndName.SERVICE;
      }
      this.service = service;
      this.handleRefresh();
    }

    private handleRefresh() {
      this.isLoading = true;
      const timeBucket = `${moment(this.time).format(this.datePickerFormat)}${this.currentSubDate}`;
      this.GET_PERFORMANCE({
        indName: this.currentIndName,
        serviceId: this.service.key,
        step: this.currentDateMode,
        timeBucket,
      }).then(() => {
        this.isLoading = false;
      });
    }

    private handleRefreshService() {
      return this.GET_SERVICES({ duration: this.durationTime }).then(() => {
        this.handleRefresh();
      });
    }

    private handleDateOption(mode: DateMode) {
      switch (mode) {
        case DateMode.DAY:
          this.datePickerFormat = 'YYYYMM';
          this.currentSubDate = moment().format('DD');
          break;
        case DateMode.HOUR:
          this.datePickerFormat = 'YYYYMMDD';
          this.currentSubDate = moment().format('HH');
          break;
        case DateMode.MINUTE:
          this.datePickerFormat = 'YYYYMMDDHH';
          this.currentSubDate = moment().format('mm');
          break;
      }
      this.currentDateMode = mode;
      this.handleRefresh();
    }
    private handleSubDateOption(value: string) {
      this.currentSubDate = value;
      this.handleRefresh();
    }
    private handleGroupOption(type: IndName) {
      this.currentIndName = type;
      this.handleRefresh();
    }

    private beforeCreate() {
      this.$store.registerModule('rocketPerformance', performance);
    }
    private beforeMount() {
      this.time = moment().toDate();
      this.handleRefreshService();
    }
    private beforeDestroy() {
      this.$store.unregisterModule('rocketPerformance');
    }
  }
</script>
<style lang="scss">
  .performance-container {
    overflow: hidden;
    padding: 20px 15px;
    height: 100%;
    flex-grow: 1;
  }

  .date-control {
    padding: 10px 0 3px 0;
  }

  .rk-performance-bar {
    flex-shrink: 0;
    color: #efefef;
    background-color: #333840;
  }
  .rk-performance-bar-reload {
    padding: 0 5px;
    border-right: 2px solid #252a2f;
  }

  .rk-performance-group-sel {
    outline: none;
    border: 0;
  }
  .rk-performance-group-add {
    position: relative;
  }
  .rk-performance-group-add-box {
    position: absolute;
    left: -10px;
    top: 35px;
    padding: 10px 5px;
    z-index: 2;
    border-radius: 4px;
    color: #eee;
    background-color: #252a2f;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  }
  .rk-performance-group-add-box:after {
    bottom: 100%;
    left: 10px;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #252a2f;
    border-width: 8px;
    margin-left: 0px;
  }
  .rk-performance-group-input {
    border: 0;
    outline: 0;
    padding: 1px 8px;
    border-radius: 4px;
  }
  .rk-performance-group-i {
    display: inline-block;
    padding: 4px 13px 4px 15px;
    border-radius: 4px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.07);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    will-change: border-color, color;
    transition: border-color 0.3s, color 0.3s;
    margin: 5px 0;
    &.active::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: 5px;
      height: 10px;
      border-radius: 4px;
      background-color: #448dfe;
      top: 9px;
      left: 4px;
    }
  }

  .rk-performance-date-more {
    background-color: #484b55;
    padding: 4px 10px;
    border-radius: 3px;
    margin-top: 8px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);

    &:after {
      bottom: 100%;
      left: 290px;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(0, 0, 0, 0);
      border-bottom-color: #484b55;
      border-width: 8px;
      margin-right: 0px;
    }
  }
</style>
