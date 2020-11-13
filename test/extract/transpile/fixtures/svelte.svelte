<script lang="ts">
  import './page.css';
  import Header from './Header.svelte';
  export let user = null;
  export let onLogin: CallableFunction;
  export const onLogout = {};
</script>

<article>
<Header {user} onLogin={onLogin} onLogout={onLogout} />
<section>
    <h2>Pages in Storybook</h2>
    <img src="./my.png" alt="my alt"/>
</section>
</article>
