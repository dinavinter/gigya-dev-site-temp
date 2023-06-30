<script lang="ts">
    export let label: string;
    export let value: string;
    export let isHorizontal: boolean = true;
</script>


<div class="field" class:is-horizontal={isHorizontal}>
    <div class="field-label">
        <label class="label">{label}</label>
    </div>
    <div class="field-body">{value}</div>
</div>

<style lang="scss">
  .field-label {
    flex-grow: 2;
  }
    .field-body {
      flex-grow: 5;
    }
</style>
