{#if show}
    <div style="background-color: {color}" in:fade={{ duration: 850 }} out:fade={{ duration: 1000 }}></div>
{/if}


<style>
    div {
        /* display */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -99;

        /* background */
        background-color: rgba(0,0,0,0);

        /* size */
        width: 100%;
        height: 100%;
    }
</style>

<script lang="ts" context="module">
    import { fade } from 'svelte/transition';

    let show : boolean = false;
    let color: string | null;

    export const set = (c: string | null) => {
        if (c) {
            color = c;
            show = true;
        } else {
            show = false;
        }
    }

    export const reset = () => set(null);
</script>