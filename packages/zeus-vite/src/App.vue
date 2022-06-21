<template>
  <div :class="$style.container">
    <div>
      <title>Zeus</title>
      <link rel="icon" href="/favicon.ico" />
    </div>
    <main :class="$style.main">
      <h1 :class="$style.title">Zeus</h1>
      <ul :class="$style.grid">
        <li :class="$style.card">
          <h2>fetch 资源</h2>
          <img alt="Fabric" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNtx8LZtmltKtApPNi14S7IzegsOxnB98r9KP1jsV0w&s" />
        </li>
        <li :class="$style.card">
          <h2>本地资源</h2>
          <img alt="Fabric" src="/source.webp" />
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style module>
.container {
  padding: 0 2rem;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  text-align: center;
  margin: 0 0 1rem;
  line-height: 1.15;
  font-size: 4rem;
}

.grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  max-width: 1080px;
  padding: 0;
  list-style: none;
}

.card {
  margin: 1rem;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  width: 480px;
}

.card:hover,
.card:focus,
.card:active {
  color: #07beff;
  border-color: #07beff;
}

.card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.card img {
  width: 100%;
}

@media (max-width: 600px) {
  .grid {
    width: 100%;
    flex-direction: column;
  }
  .card {
    width: 100%;
    margin: 1rem 0;
  }
}
</style>

<style>
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
}

a:hover {
  color: #07beff;
}

* {
  box-sizing: border-box;
}
</style>
