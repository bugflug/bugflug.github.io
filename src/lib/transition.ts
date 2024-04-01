import { cubicInOut } from 'svelte/easing';

export const slidefade = (node: Element, { delay, duration, easing, direction }: any) => {
    const existing = getComputedStyle(node).transform.replace('none', '');

    let factor: number[] = [0, -10];
    switch (direction) {
        case 'up'   : factor = [0  , -10]; break;
        case 'right': factor = [10 , 0  ]; break;
        case 'down' : factor = [0  , 10 ]; break;
        case 'left' : factor = [-10, 0  ]; break;
    };

    return {
        delay: delay || 0,
        duration: duration || 200,
        easing: easing || cubicInOut,
        css: (t: any, u: any) => `
            transform-origin: top left;
            transform: ${existing} translate(${factor[0] * u}%, ${factor[1] * u}%);
            opacity: ${t};
        `
    }
}

export const comeinfade = (node: Element, { delay, duration, easing }: any) => {
    const existing = getComputedStyle(node).transform.replace('none', '');

    return {
        delay: delay || 0,
        duration: duration || 200,
        easing: easing || cubicInOut,
        css: (t: any, u: any) => `
            transform-origin: top left;
            /* transform: ${existing} scale(${(u * 10) / 2}%); */
            opacity: ${t};
        `
    }
}