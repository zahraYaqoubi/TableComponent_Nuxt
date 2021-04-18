<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default': ''">
    <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent': ''">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0" :class="type === 'dark' ? 'text-white': ''">{{title}}</h3>
        </div>
      </div>
    </div>
    <div style="min-height:300px;" class="table-responsive" v-if="!isLoading">
      <base-table
        class="table align-items-center table-flush"
        :class="type === 'dark' ? 'table-dark': ''"
        :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
        tbody-classes="list"
        :data="showSortedData"
      >
        <template slot="columns">
          <th class="text-center px-0">
            <div class="d-inline-flex mt-3 bg-white mr-1"></div>
          </th>

          <th
            v-for="(modelTitle,colIndex) in tableInput.model"
            :key="'title'+colIndex"
            class="text-center px-0"
          >
            <div
              class="mx-lg-5 mx-md-4 mx-sm-3"
              @click="sort(modelTitle)"
              :style="[modelTitle.isSortable ? {'cursor':'pointer'} : {}]"
            >
              {{modelTitle.title}}
              <img
                src="@/assets/upArrow.png"
                class="d-inline-flex"
                v-if="modelTitle.icon == 'up'"
              />
              <img
                id="downArrow"
                src="@/assets/upArrow.png"
                class="d-inline-flex"
                v-if="modelTitle.icon == 'down'"
              />
            </div>
            <search-field
              v-if="modelTitle.isSearchable"
              v-on:emitEnter="FilterSearch(colIndex)"
              v-on:searchField="emitSearchField(colIndex,$event)"
              v-bind:modelTitle="modelTitle"
            ></search-field>
          </th>
        </template>

        <template slot-scope="{row}">
          <td class="text-center">{{Users.indexOf(row)+offset+1}}</td>
          <td
            v-for="(tableCol,index) in tableInput.model"
            :key="tableCol+index"
            class="text-center"
          >
            <a
              v-if="tableCol.colKey == 'email'"
              :href="showRows(row,tableCol)"
            >{{showRows(row,tableCol)}}</a>
            <div v-else>{{showRows(row,tableCol)}}</div>
          </td>
        </template>
      </base-table>
    </div>

    <div class="row mt-4 justify-content-center">
      <div v-if="isLoading">
        <img src="@/assets/loading.png" alt="Loading..." />
      </div>
    </div>
    <div
      class="bg-green p-3 text-white text-center"
      v-if="!isLoading & Users==''"
    >The data doesn't exist!</div>

    <div
      class="card-footer d-flex justify-content-end"
      :class="type === 'dark' ? 'bg-transparent': ''"
    >
      <base-pagination
        v-on:value="emittedValue"
        v-on:selectedLimit="emittedLimit"
        v-bind:totalRecords="totalRecords"
      ></base-pagination>
    </div>
  </div>
</template>
<script>
import SearchField from "./Table/SearchField";
import BaseTable from "./Table/BaseTable";
import BasePagination from "./Table/BasePagination";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "table",
  components: {
    SearchField,
    BaseTable,
    BasePagination
  },
  props: ["tableInput"],
  data() {
    return {
      title: "Users",
      type: "light",
      value: 1,
      limit: 2,
      offset: 0,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["Users", "totalRecords"]),
    showSortedData() {
      var key1 = this.tableInput.sortedColKey1;
      var key2 = this.tableInput.sortedColKey2;
      console.log("in showSortedData");
      console.log("Users: ", JSON.stringify(this.Users));
      console.log("key1: " + key1 + " ,key2: " + key2);
      if (!key1) {
        return this.Users;
      }
      return this.Users.sort((a, b) => {
        console.log("a: " + JSON.stringify(a));
        console.log("b: " + JSON.stringify(b));
        var res =
          key2 != ""
            ? a[key1][key2].localeCompare(b[key1][key2])
            : a[key1].localeCompare(b[key1]);

        if (this.tableInput.sort === "DESC") {
          res = res * -1;
        }
        console.log(this.tableInput.sort + " sorted");
        console.log("result: " + res);
        return res;
      });
    }
  },
  created() {
    console.log("it's created");
    this.tableInput.sort = "DESC";
    this.countResults();
  },
  methods: {
    sort(model) {
      this.tableInput.model.forEach(el => {
        el.icon = "";
      });
      if (!model.isSortable) {
        return;
      } else if (this.tableInput.sort == "DESC") {
        model.icon = "down";
        this.tableInput.sort = "ASC";
      } else {
        model.icon = "up";
        this.tableInput.sort = "DESC";
      }
      this.tableInput.sortedColKey1 = model.colKey;
      this.tableInput.sortedColKey2 = model.secondKey;
      this.countResults();
    },
    showRows(row, tableCol) {
      var rowTxt = "";
      var tableColItem = tableCol.colKey;
      var secondColKey = tableCol.secondKey;
      if (secondColKey != "") {
        rowTxt = row[tableColItem][secondColKey];
      } else {
        rowTxt = row[tableColItem];
      }
      return rowTxt;
    },
    emitSearchField(colIndex, event) {
      this.tableInput.model[colIndex] = event;
      console.log(
        "emitSearchField: " +
          colIndex +
          " " +
          JSON.stringify(this.tableInput.model)
      );
    },
    emittedValue(event) {
      this.value = event;
      this.countResults();
    },
    emittedLimit(limit) {
      this.limit = limit;
      console.log("emittedLimit: " + limit);
      this.countResults();
    },
    FilterSearch(colIndex) {
      this.isLoading = true;
      this.offset = (this.value - 1) * this.limit;

      console.log(
        "value: " +
          this.value +
          " ,offset: " +
          this.offset +
          " ,limit: " +
          this.limit
      );
      axios
        .get(this.tableInput.url)
        .then(res => {
          let colKey = this.tableInput.model[colIndex].colKey;
          let secondKey = this.tableInput.model[colIndex].secondKey;
          let matchedResults = res.data.filter(el =>
            secondKey != ""
              ? el[colKey][secondKey]
                  .toLowerCase()
                  .includes(
                    this.tableInput.model[colIndex].searchText.toLowerCase()
                  )
              : el[colKey]
                  .toLowerCase()
                  .includes(
                    this.tableInput.model[colIndex].searchText.toLowerCase()
                  )
          );
          this.$store.commit(
            "setUsers",
            matchedResults.slice(this.offset, this.offset + this.limit)
          );
          this.$store.commit("setNumberOfRecords", matchedResults.length);
          console.log("matched users: " + JSON.stringify(matchedResults));
          console.log(
            "totalRecords: " +
              this.totalRecords +
              " ,Users: " +
              JSON.stringify(this.Users)
          );

          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          context.error(e);
        });
    },
    countResults() {
      this.isLoading = true;
      this.offset = (this.value - 1) * this.limit;

      console.log(
        "value: " +
          this.value +
          " ,offset: " +
          this.offset +
          " ,limit: " +
          this.limit
      );

      axios
        .get(this.tableInput.url)
        .then(res => {
          this.$store.commit(
            "setUsers",
            res.data.slice(this.offset, this.offset + this.limit)
          );
          // console.log("changed users: " + this.Users[0].name);

          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          context.error(e);
        });
    }
  }
};
</script>
<style>
/* .fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
}
.fade-leave-active {
  transition: opacity 1s;
  position: absolute;
  opacity: 0;
} */
#downArrow {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
</style>
