<div class="card">
    <div class="inner">
        <slot />
    </div>
</div>

<style>
    .card {
        /* background */
        background: var(--bg-2);

        /* border */
        border: 0.15rem solid var(--bg-2);
        border-bottom: 0.45rem solid var(--bg-2);
        border-radius: 0.45rem;
    }

    .card .inner {
        /* size */
        padding: 1rem;

        /* background */
        background: var(--bg-1);

        /* border */
        border-radius: 0.45rem;
    }
</style>