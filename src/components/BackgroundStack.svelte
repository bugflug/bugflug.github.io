<!--
    Stack of backgrounds that fade in and out on top of each other.
    Avoids disrupting router navigation by existing outside of it.
-->

{#each $backgrounds as b}
    <div
        style={b.style}
        class={`background ${b.clazz}`}
        in:fade={{ duration: 1000 }}
        out:fade={{ duration: 1000 }}
    >
        <!-- use smooth image loading if this bg has an image -->
        {#if (b.image !== undefined)}<LazyImage url={b.image} duration={1000} />{/if}
    </div>

{/each}

<style>
    .background {
        /* display */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -99;
        display: flex;
        justify-content: center;
        align-items: center;

        /* background */
        /* TODO! */

        /* size */
        width: 100%;
        height: 100%;
    }

    .background :global(img) {
        /* display */
        object-fit: cover;

        /* size */
        width: 100%;
        height: 100%;
    }
</style>

<script lang="ts" context="module">
    import { writable, type Writable } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import { base } from '$app/paths';

    import LazyImage from '$src/components/LazyImage.svelte';

    /**
     * Background object with data like color, img, etc.
     * @typedef {Object} background
     * */
    export type background = {
        /** CSS to apply to this background. */
        style?: string;
        /** HTML class to give to this background. */
        clazz?: string;
        /** CSS color code. */
        color?: string;
        /** URL to an image in `static`. */
        image?: string;
    };

    /**
     * List of backgrounds.
     * Uses a `writable()` store to be reactive from inside a `<script context="module">`.
     * */
    let backgrounds: Writable<background[]> = writable([]);

    /**
     * Add a background.
     * @param [b] {background} Background to add to the stack.
     * */
    export const addBackground = (b: background = { color: 'inherit' }) => {
        // add the color and image to the style
        if (b.style === undefined) b.style = '';
        if (b.clazz === undefined) b.clazz = '';
        if (b.color !== undefined) b.style = `${b.style} background-color: ${b.color};`;
        if (b.image !== undefined) b.style = `${b.style} background-image: url(${base}/${b.image})`;

        console.log(b.color);
        backgrounds.update((bs) => [...bs, b]);
    }
</script>

<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    page.subscribe(page => {
        // clear ALL backgrounds when the URL changes.
        // guaranteed to fire before the new page loads in, because
        // onMount() will not have fired to add a background yet.
        backgrounds.set([]);
    });
</script>