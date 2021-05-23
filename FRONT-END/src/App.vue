<template>
  <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/poll">Poll</router-link> |
    <router-link to="/results">Poll Results</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  button,
  a,
  li,
  input {
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: black;
  }
  ul {
    padding: 0;
  }
}
</style>
