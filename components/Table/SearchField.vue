<template>
  <div class="d-inline-flex mt-3 mx-2">
    <input
      @keyup.enter="enterInput"
      v-model.number="modelTitle.searchText"
      @change="$emit( 'searchField', modelTitle )"
      class="form-control form-control-sm"
      :placeholder="title"
    />
  </div>
</template>

<script>
export default {
  props: ["modelTitle"],
  data() {
    return {
      searchField: "",
      title: "Search " + this.modelTitle.title
    };
  },
  methods: {
    enterInput() {
      this.$emit("emitEnter");
      console.log("emitEnter");
    }
  }
};
</script>
<style>
</style>