<template>
  <div :class="$style.container">
    <Head>
      <title>Sanzo</title>
      <meta
        name="description"
        content="Sanzo is a demo for customized resource retrieval based on Service Worker API."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main :class="$style.main">
      <h1 :class="$style.title">Sanzo</h1>

      <p :class="$style.description">
        <a href="https://github.com/nighca/sanzo">Sanzo</a> is a demo for
        customized resource retrieval based on&nbsp;
        <a
          target="_blank"
          rel="noreferrer"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
        >
          Service Worker API </a
        >.
      </p>

      <p :class="$style.description">
        Resources below are expected to be retrieved from site2
        <code>{originalHost}</code>, which does not exist. Instead they are
        retrieved from site <code>{targetHost}</code> under the hood.
      </p>

      <ul :class="$style.grid">
        <li :class="$style.card">
          <h2>Image</h2>
          <img alt="Fabric" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNtx8LZtmltKtApPNi14S7IzegsOxnB98r9KP1jsV0w&s" />
          <UrlInfo path="/sanzo/samples/fabric.jpg" />
        </li>
        <li :class="$style.card">
          <h2>Video</h2>
          <!-- <video
            controls
            src="https://sanzo.io/sanzo/samples/forest.mp4"
          ></video> -->
          <UrlInfo path="/sanzo/samples/forest.mp4" />
        </li>

        <li :class="$style.card">
          <h2>Audio</h2>
          <!-- <audio
            controls
            src="https://sanzo.io/sanzo/samples/ukulele.mp3"
          ></audio> -->
          <UrlInfo path="/sanzo/samples/ukulele.mp3" />
        </li>

        <li :class="$style.card">
          <h2>Long Video</h2>
          <!-- <video
            controls
            src="https://sanzo.io/sanzo/samples/the-internets-own-boy.ogv"
          ></video> -->
          <UrlInfo path="/sanzo/samples/the-internets-own-boy.ogv" />
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import UrlInfo from "./components/UrlInfo.vue";
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

.footer {
  display: flex;
  flex: 1;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
}

.footer a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.title a {
  color: #07beff;
  text-decoration: none;
}

.title a:hover,
.title a:focus,
.title a:active {
  text-decoration: underline;
}

.title {
  margin: 0 0 1rem;
  line-height: 1.15;
  font-size: 4rem;
}

.title,
.description {
  text-align: center;
}

.description {
  margin: 0.5rem 0;
  max-width: 640px;
  line-height: 1.5;
  color: #666;
}

.code {
  background: #fafafa;
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
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

.card img,
.card video,
.card audio {
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
