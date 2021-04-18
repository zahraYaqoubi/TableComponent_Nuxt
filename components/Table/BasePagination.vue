<template>
  <div class="container">
    <div class="col">
      <div class="row justify-content-center">
        <ul
          class="pagination"
          :class="[size && `pagination-${size}`, align && `justify-content-${align}`]"
        >
          <li style="cursor:pointer" class="page-item prev-page" :class="{disabled: value === 1}">
            <a class="page-link" aria-label="Previous" @click="prevPage">
              <span aria-hidden="true">
                <!-- <i class="fa fa-angle-right" aria-hidden="true"></i> -->
                <img id="leftArrow" src="../../assets/next.png" alt="left" />
              </span>
            </a>
          </li>
          <li
            style="cursor:pointer"
            class="page-item"
            :class="{active: value === item}"
            :key="item"
            v-for="item in range(minPage, maxPage)"
          >
            <a class="page-link" @click="changePage(item)">{{item}}</a>
          </li>
          <li
            style="cursor:pointer"
            class="page-item next-page"
            :class="{disabled: value === totalPages}"
          >
            <a class="page-link" aria-label="Next" @click="nextPage">
              <span aria-hidden="true">
                <!-- <i class="fa fa-angle-left" aria-hidden="true"></i> -->
                <img src="../../assets/next.png" alt="right" />
              </span>
            </a>
          </li>
        </ul>

        <ul class="pagination float-left" :class="[size && `pagination-${size}`]">
          <li
            style="cursor:pointer"
            class="page-item"
            :class="{active: selectedLimit === item}"
            :key="item"
            v-for="item in limitArray"
          >
            <a class="page-link" @click="changeLimit(item)">{{item}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "base-pagination",
  props: ["totalRecords"],
  data() {
    return {
      defaultPagesToDisplay: 2,
      value: 1,
      perPage: 2,
      pageCount: 0,
      size: "md",
      align: "right",
      limitArray: [1, 2, 5, 10],
      selectedLimit: 4
    };
  },
  computed: {
    totalPages() {
      // if (this.pageCount > 0) return this.pageCount;
      console.log("perpage: " + this.perPage);
      if (this.totalRecords > 0) {
        return Math.ceil(this.totalRecords / this.perPage);
      }
      return 1;
    },
    pagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages;
      }
      return this.defaultPagesToDisplay;
    },
    minPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1;
        }
        return this.value - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.pagesToDisplay;
      }
    }
  },
  methods: {
    changeLimit(limit) {
      this.selectedLimit = limit;
      this.perPage = limit;
      console.log("in changeLimit, perpage: " + this.perPage);
      // alert(limit);
    },
    range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    changePage(item) {
      this.value = item;
      console.log("changePage input: " + this.value);
    },
    nextPage() {
      // this.totalPages = Math.ceil(this.totalRecords / this.perPage);
      if (this.value < this.totalPages) {
        this.value = this.value + 1;
      }
      console.log("nextPage input: " + this.value);
      console.log("perPage: " + this.perPage);
      console.log("totalPages: " + this.totalPages);
    },
    prevPage() {
      if (this.value > 1) {
        this.value = this.value - 1;
      }
      console.log("prevPage input: " + this.value);
    }
  },
  watch: {
    perPage() {
      this.value = 1;
      console.log("perPage input: " + this.value);
    },
    totalRecords() {
      this.value = 1;
      console.log("total input: " + this.value);
    },
    value() {
      console.log("value: " + this.value);
      this.$emit("value", this.value);
    },
    selectedLimit() {
      console.log("selectedLimit: " + this.selectedLimit);
      this.$emit("selectedLimit", this.selectedLimit);
    }
  }
};
</script>
<style scoped>
#leftArrow {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
</style>