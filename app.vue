<script setup lang="ts">
const message = apiRef({
  route: '/api/auth/login',
  method: 'post',
  defaultValue: null
});

const { data } = await useFetch('/api/auth/login', {
  method: 'post',
  body: {
    id: '2c2ec01b-ea45-4b5b-81ed-0bbbf2a06e28'
  }
});

message.value = data.value;

</script>

<template>
  <div>
    <h1>
      API Response
    </h1>
    <pre>{{ message }}</pre>
  </div>
</template>
