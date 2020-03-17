<template>
  <div class="rk-table-warpper" :style="isTableLayoutFixed ? 'overflow: hidden;': 'overflow: auto;'">
    <div class="rk-table" :class="{ 'rk-table-bordered': bordered, 'rk-table-layout-fixed': isTableLayoutFixed }">
      <div class="rk-table-container">
        <div v-if="isTableLayoutFixed" class="rk-table-header" ref="header" style="overflow: hidden;">
          <table :style="scrollXStyle" ref="headerTable">
            <colgroup>
              <col v-for="(column, index) in columns" :key="`key_${index}`" :style="{ width: `${column.width}px`, 'min-width': `${column.width}px` }" />
            </colgroup>
            <thead class="rk-table-thead">
              <tr>
                <th v-for="(column, index) in columns" v-on:click="sortBy(column, index)" :class="columnClass(column, index)" :style="{ 'text-align': column.columnAlign }" :key="`key_${index}`">
                  <span class="rk-table-header-column">
                    <div :class="{ 'rk-table-column-sorters': column.sorter }">
                      <span class="rk-table-column-title" :title="column.ellipsis ? column.title : ''">
                        {{
                        column.title | capitalize
                        }}
                      </span>
                      <span class="rk-table-column-sorter">
                        <div title="排序" class="rk-table-column-sorter-inner rk-table-column-sorter-inner-full" v-if="column.sorter">
                          <i aria-label="图标: caret-up" class="icon icon-caret-up rk-table-column-sorter-up" :class="sorterStatusCls(column, 'asc')">
                            <svg viewBox="0 0 1024 1024" focusable="false" class data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <use xlink:href="#caret-up" />
                            </svg>
                          </i>
                          <i aria-label="图标: caret-down" class="icon icon-caret-down rk-table-column-sorter-down" :class="sorterStatusCls(column, 'desc')">
                            <svg viewBox="0 0 1024 1024" focusable="false" class data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <use xlink:href="#caret-down" />
                            </svg>
                          </i>
                        </div>
                      </span>
                    </div>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="rk-table-body" ref="body" :style="scrollBodyStyle">
          <table ref="bodyTable" :style="scrollXStyle">
            <colgroup>
              <col v-for="(column, index) in columns" :key="`key_${index}`" :style="{ width: `${column.width}px`, 'min-width': `${column.width}px` }" />
            </colgroup>
            <thead v-if="!isTableLayoutFixed" class="rk-table-thead">
              <tr>
                <th v-for="(column, index) in columns" @click="sortBy(column, index)" :class="columnClass(column, index)" :key="`key_${index}`">
                  <span class="rk-table-header-column">
                    <div :class="{ 'rk-table-column-sorters': column.sorter }">
                      <span class="rk-table-column-title" :title="column.ellipsis ? column.title : ''">
                        {{ column.title | capitalize }}
                      </span>
                      <span class="rk-table-column-sorter">
                        <div title="排序" class="rk-table-column-sorter-inner rk-table-column-sorter-inner-full" v-if="column.sorter">
                          <i aria-label="图标: caret-up" class="icon icon-caret-up rk-table-column-sorter-up off">
                            <svg viewBox="0 0 1024 1024" focusable="false" class data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <use xlink:href="#caret-up" />
                            </svg>
                          </i>
                          <i aria-label="图标: caret-down" class="icon icon-caret-down rk-table-column-sorter-down off">
                            <svg viewBox="0 0 1024 1024" focusable="false" class data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <use xlink:href="#caret-down" />
                            </svg>
                          </i>
                        </div>
                      </span>
                    </div>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="rk-table-tbody">
              <tr v-for="(entry, index) in processData" :key="`key_${index}`">
                <td
                  v-for="(column, index) in columns"
                  :key="`key_${index}`"
                  :class="column.ellipsis ? 'rk-table-row-cell-ellipsis' : 'rk-table-row-cell-break-word'"
                  :style="{ 'text-align': column.columnAlign }"
                >
                  <div
                    v-tooltip:bottom.ellipsis="{
                        content: tooltipFormatter(entry[column.key]),
                        popperCls: ['rk-table-tooltip'],
                      }"
                      v-html="entry[column.key]"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
  import copy from '@/utils/copy';
  import _ from 'lodash';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
    },
    props: {
      tableLayout: {
        type: String,
      },
      scroll: Object,
      data: Array,
      bordered: Boolean,
      loading: Boolean,
      columns: Array,
      defaultSortType: {
        type: String,
        default: 'desc'
      },
    },
    data () {
      // this.column
      return {
        sortKey: '',
        sortType: 'minus'
      }
    },
    computed: {
      scrollBodyStyle() {
        if( this.scroll && this.scroll.y) {
          return `overflow: scroll; max-height: ${this.scroll.y}px;`
        } else {
          return `overflow: scroll;max-height: calc(100% - 30px);`
        } 
      },
      scrollXStyle() {
        if( this.scroll && this.scroll.x) {
          return `width: ${this.scroll.x}px; min-width: 100%; table-layout: fixed;`
        }
      },
      isTableLayoutFixed() {
        if(this.tableLayout === 'fixed' || this.columns.some((column) => {return column.ellipsis === true})) {
          return true;
        } else {
          return false;
        }
      },
      windowWidth() {
        if (window.innerWidth) {
          return window.innerWidth
        } else {
          return document.body.clientWidth
        }
      },
      processData () {
        const sortKey = this.sortKey
        const sortType = this.sortType;
        const data = this.data
        if (!sortKey) return data;

        let ret = [...data];
        if (typeof sortType  === 'string') {
          if (sortType === 'asc') {
            ret = ret.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1);
          } else if (sortType === 'desc') {
            ret = ret.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : 1);
          }
        } else {
          if (sortType === 'asc') {
            ret = ret.sort((a, b) => parseFloat(a[sortKey]) > parseFloat(b[sortKey]) ? 1 : -1);
          } else if (sortType === 'desc') {
            ret = ret.sort((a, b) => parseFloat(a[sortKey]) > parseFloat(b[sortKey]) ? -1 : 1);
          }
        }

        return ret
      }
    },
    filters: {
      capitalize (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    methods: {
      sortBy (column, i) {
        if(column.sorter) {
          const sortKey = this.sortKey;
          if(sortKey === '' || this.sortType === 'minus') {
            this.sortKey = column.key;
            this.sortType = column.sortType || this.defaultSortType;
          } else if(sortKey === column.key) {
            if(this.sortType === this.defaultSortType) {
              this.sortType = this.defaultSortType === 'asc'? 'desc': 'asc';
            } else {
              this.sortType = 'minus';
            }
          } else {
            this.sortKey = column.key;
            this.sortType = column.sortType || this.defaultSortType;
          }
        } 
      },
      sorterStatusCls(column, sortStatus) {
        if(column.key === this.sortKey ) {
          if( this.sortType === sortStatus) {
            return 'on';
          } else {
            return 'off';
          }
        }

        return 'off';
      },
      columnClass (column, i) {
        let className = []
        if(column.sorter) {
          className.push('rk-table-column-has-actions');
          className.push('rk-table-column-has-sorters');
        }
        if(column.ellipsis) {
          className.push('rk-table-row-cell-ellipsis');
        } else {
          className.push('rk-table-row-cell-break-word');
        }
        return className.join(' ')
      },
      calScroll () {
        const { header, body, root, bodyTable, headerTable } = this.$refs

        body.addEventListener('scroll', (event) => {
          header.scrollLeft = event.target.scrollLeft
        }, false)
      },
      tooltipFormatter(item) {
        if( _.isString(item)) {
          return item;
        }
        return JSON.stringify(item);
      },
    },
    mounted() {
      this.calScroll()
    }
  };
</script>

<style lang="scss" scoped>
  .rk-table-warpper {
    height: 100%;
    &::before {
      display: table;
      content: '';
    }
  }

  .rk-table {
    position: relative;
    transition: opacity 0.3s;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
    clear: both;
    z-index: 0;
    background: #fff;
    height: 100%;

    .rk-table-container {
      height: 100%;
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
      &::before,
      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 1;
        width: 20px;
        transition: box-shadow 0.3s;
        content: "";
        pointer-events: none;
      }
    }

    &.rk-table-bordered {
      border: 1px solid rgba(0, 0, 0, 0.1);
      table {
        th,
        td {
          border-right: 1px dotted silver;
        }
      }
    }

    table {
      width: 100%;
      text-align: left;
      border-collapse: separate;
      border-spacing: 0;
    }

    // .rk-table-fixed-left {
    //   position: absolute;
    //   top: 0;
    //   z-index: auto;
    //   overflow: hidden;
    //   border-radius: 0;
    //   transition: box-shadow 0.3s ease;
    //   box-shadow: none;
    //   table {
    //     width: auto;
    //   }
    // }
    // .rk-table-fixed-right {
    //   position: absolute;
    //   right: 0;
    //   z-index: auto;
    //   overflow: hidden;
    //   border-radius: 0;
    //   transition: box-shadow 0.3s ease;
    //   box-shadow: none;
    //   table {
    //     width: auto;
    //   }
    // }

    // .rk-table-header {
    //   overflow: hidden;
    //   &::-webkit-scrollbar {
    //     display: none;
    //   }
    //   -ms-overflow-style: none;
    //   scrollbar-width: none;
    //   -ms-overflow-style: none;
    //   overflow: -moz-scrollbars-none;
    // }
    // .rk-table-body {
    //   position: relative;
    //   &:focus {
    //     outline: none;
    //   }
    // }

    thead > tr > th,
    tbody > tr > td,
    tfoot > tr > th,
    tfoot > tr > td {
      position: relative;
      line-height: 30px;
      padding: 0 4px;
      overflow-wrap: break-word;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      transition: background 0.3s ease;
    }

    thead > tr > th {
      background-color: #f3f4f9;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      text-align: left;
      &:hover {
        background-color: #eeeff7;
      }
      &:last-child {
        border-right: 0;
      }

      &.rk-table-column-has-actions {
        position: relative;
        background-clip: padding-box;
        -webkit-background-clip: border-box;
      }
      &.rk-table-column-has-sorters {
        cursor: pointer;
        user-select: none;
      }

      .rk-table-header-column {
        display: inline-block;
        max-width: 100%;
        vertical-align: top;
        .rk-table-column-sorters {
          display: table;
          &::before {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: transparent;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            content: "";
          }

          > *:not(.rk-table-column-sorter) {
            position: relative;
          }

          .rk-table-column-title {
            display: table-cell;
            vertical-align: middle;
          }
        }

        .rk-table-column-sorter {
          display: table-cell;
          vertical-align: middle;
          .rk-table-column-sorter-inner {
            height: 1em;
            margin-top: 0.35em;
            margin-left: 0.57142857em;
            color: #bfbfbf;
            line-height: 1em;
            text-align: center;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;

            .rk-table-column-sorter-up,
            .rk-table-column-sorter-down {
              display: inline-block;
              font-size: 12px;
              font-size: 11px \9;
              -webkit-transform: scale(0.91666667) rotate(0deg);
              -ms-transform: scale(0.91666667) rotate(0deg);
              transform: scale(0.91666667) rotate(0deg);
              display: block;
              height: 1em;
              line-height: 1em;
              -webkit-transition: all 0.3s;
              transition: all 0.3s;
              &.on {
                color: #448dfe;
              }
            }
          }
          .rk-table-column-sorter-inner-full {
            margin-top: -0.15em;
            .rk-table-column-sorter-up,
            .rk-table-column-sorter-down {
              height: 0.5em;
              line-height: 0.5em;
            }
          }
        }
      }
    }

    tbody > tr > td {
      transition: background 0.3s;
      &:last-child {
        border-right: 0;
      }
    }
    tbody > tr {
      &:hover {
        color: #448dfe;
        background: rgba(0, 0, 0, 0.04);
      }
      &:last-child {
        td {
          border-bottom: 0;
        }
      }
    }
  }

  .rk-table-row-cell-ellipsis,
  .rk-table-row-cell-ellipsis .rk-table-column-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .rk-table-row-cell-break-word {
    word-wrap: break-word;
    word-break: break-word;
  }

  .icon {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
<style lang="scss">
  .rk-tooltip-popper.rk-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
</style>
