<script setup lang="ts">
const props = defineProps<{ path: string }>()
const originalHost = "sanzo.io";
// const targetHost = 'opmna640q.qnssl.com'
const targetHost = "cdn-static-file.qiniu.io";
const originalUrl = `https://${originalHost}${props.path}`;
const newUrl = `https://${targetHost}${props.path}`;
</script>
<template>
  <p :class="$style.url">
    <a target="_blank" rel="noreferrer" :href="originalUrl"
      ><code>{{originalHost}}</code></a
    >&nbsp; &rarr; &nbsp;<a target="_blank" rel="noreferrer" :href="newUrl"
      ><code>{{targetHost}}</code></a
    >
  </p>
</template>

<style module>
.url {
  margin: 1em 0 0;
  line-height: 1.5;
  font-size: 0.8rem;
  color: #666;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
