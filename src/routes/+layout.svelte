<script lang="ts">
    // CSS
    import '../style/normalize.css';
    import '../style/main.css';

    // components
    import BackgroundStack from '../components/BackgroundStack.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<BackgroundStack />
<slot />
<Footer></Footer>