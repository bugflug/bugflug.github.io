<script lang="ts">
    import Footer from '../components/Footer.svelte';

    import '../style/normalize.css';
    import '../style/main.css';

    import { createEventDispatcher } from 'svelte';

    import { backgroundStyle, backgroundOpacity } from '../store/background';

    import Background from '../components/Background.svelte';

    /** Unwrapped value from the background store. */
    let style   = 'none';
    let opacity = '0';
    /** Unwrapped value from the background store. */
    backgroundStyle  .subscribe((value) => style   = value);
    backgroundOpacity.subscribe((value) => opacity = value);
</script>

<style>
    /* #page-wrapper {
        display: flex;
        justify-content: center;
        align-items: flex-start;;
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        overflow: scroll;
    } */

    #background {
        /* display */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -99;

        /* colors */
        opacity: 1;

        /* size */
        width: 100%;
        height: 100%;

        /* animation */
        transition: opacity 1000ms ease;
    }
</style>

<!-- force a transition on every page change -->
<!--{#key data.url}
    <div id="page-wrapper" in:fadeSlide={{ delay: 200, duration: 150 }} out:fadeSlide={{ delay: 0, duration: 150 }}>
        <slot />
    </div>
{/key}-->

<div id="background" style="background: {style}; opacity: {opacity};"></div>
<Background />
<slot />

<Footer></Footer>