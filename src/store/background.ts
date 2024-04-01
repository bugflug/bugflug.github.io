import { writable } from 'svelte/store';

/**
 * Optional accent background style.
 */
export const backgroundStyle = writable('none');

/**
 * Opacity of the accent background. Transitions automatically.
 */
export const backgroundOpacity = writable('0');