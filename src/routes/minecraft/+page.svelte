<div id="page" class="corrected">
    <div>
        <h2>schematics</h2>
        <div class="card glass"></div>
    </div>
    <div>
        <h2>world saves</h2>
        <div class="card glass"></div>
    </div>
</div>

<style>
    #page {
        /* display */
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    @media (orientation: landscape) {
        #page {
            /* display */
            grid-template-columns: 1fr 1fr;
            grid-template-auto-rows: min-content;
        }
    }

    @media (orientation: portrait) {
        #page {
            /* display */
            grid-template-columns: 1fr;
            grid-template-rows: min-content;
        }

        h2 {
            /* font */
            text-align: center;
        }
    }
</style>

<script lang="ts">
    // import { goto } from '$app/navigation';
    // import { base } from '$app/paths';
    // import { onMount } from 'svelte';

    // redirect
    // onMount(() => goto(base + '/'));
</script>