<script setup lang="ts">
  const message = apiRef({
    route: '/api/auth/login',
    method: 'post',
    defaultValue: (await useFetch('/api/auth/login', {
      method: 'post',
      body: {
        email: 'phu.nguyen2310@hcmut.edu.vn',
        password: '123456789'
      }
    })).data
  });
</script>

<template>
  <div>
    <h1>
      API Response
    </h1>
    <pre>{{ message }}</pre>
  </div>
</template>
