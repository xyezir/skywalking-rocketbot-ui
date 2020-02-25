import graph from '@/graph';
import * as types from '@/store/mutation-types';
import { Option } from '@/types/global';
import { PerformanceType } from '@/types/performance';
import { AxiosResponse } from 'axios';
import { ActionTree, Commit, Dispatch, MutationTree } from 'vuex';

export const enum IndName {
  SERVICE = 'service',
  INSTANCE = 'service_instance',
  ENDPOINT = 'endpoint',
}

export const enum DateMode {
  DAY = 'DAY',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
}

export interface State {
  services: Option[];
  performances: PerformanceType[];
  indMode: string[];
  serviceId: string;
  step: DateMode;
  timeBucket: string;
  indName: IndName;
}

const initState: State = {
  services: [],
  performances: [],
  indMode: [IndName.SERVICE, IndName.INSTANCE, IndName.ENDPOINT],
  serviceId: '',
  step: DateMode.DAY,
  timeBucket: '',
  indName: IndName.SERVICE,
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_PERFORMANCE_SERVICES](state: State, data: Option[]): void {
    state.services = [{ label: 'All', key: '' }].concat(data);
  },
  [types.SET_PERFORMANCE](state: State, data: PerformanceType[]): void {
    state.performances = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: any): Promise<void> {
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_PERFORMANCE_SERVICES, res.data.data.services);
      });
  },
  GET_PERFORMANCE(context: { commit: Commit }, params: any): Promise<void> {
    return graph
      .query('queryPerformances')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_PERFORMANCE, res.data.data.performances);
      });
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
