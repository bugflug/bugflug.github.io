<img alt="" bind:this={el} style="transition: opacity {duration}ms ease;" >

<style>
    img {
        /* colors */
        opacity: 0;

        /* animation */
        transition: opacity 5500ms ease;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';

    /** Source URL. */
    export let url: string;
    /** Transition duration in milliseconds. */
    export let duration: number = 500;

    let el: HTMLImageElement;

    onMount(() => {
        // load the img manually so the
        // hook below gets processed correctly
        el.src = url;

        // fade dat shit in brother
        el.addEventListener('load', () => {
            el.style.opacity = '1';
        });
    });
</script>