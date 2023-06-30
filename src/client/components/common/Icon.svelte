<script lang="ts">
    export let path: string;
    export let size: number = 1;
    export let color: string = 'currentColor';

    let transform;
    $: {
        transform = `scale(${size})`
    }
</script>

<svg class="{$$props.class || ''}"
     style:width={`${size * 1.5}rem`}
     style:height={`${size * 1.5}rem`}>
    <g style:transform>
        <path d={path}
              style:fill={color} />
        <rect width="24" height="24" fill="transparent" />
    </g>
</svg>