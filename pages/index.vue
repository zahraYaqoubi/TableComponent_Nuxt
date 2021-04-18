<template>
  <div>
    <my-table v-bind:tableInput="tableInput"/>
  </div>
</template>
<script>
import MyTable from "../components/Table";

export default {
  data() {
    return {
      tableInput: {
        limit: 5,
        url: 'https://jsonplaceholder.typicode.com/users',
        model: [
          {
            title: "Name",
            isSearchable: true,
            isSortable: true,
            colKey: ["name"],
            secondKey: [],
          },
          {
            title: "Email",
            isSearchable: false,
            isSortable: true,
            colKey: ["email"],
            secondKey: [],
          },
          {
            title: "Company Name",
            isSearchable: true,
            isSortable: true,
            colKey: ["company"],
            secondKey: ["name"],
          },
          {
            title: "City",
            isSearchable: true,
            isSortable: true,
            colKey: ["address"],
            secondKey: ["city"],
          },
          {
            title: "Website",
            isSearchable: false,
            isSortable: false,
            colKey: ["website"],
            secondKey: [],
          }
        ]
      }
    };
  },
  components: {
    MyTable
  }
};
</script>