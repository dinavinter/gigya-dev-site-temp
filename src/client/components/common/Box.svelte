<div class="box {$$props.class || ''}">
    <slot />
</div>

<style lang="scss">
  @import "src/client/mixin";
  @import "src/client/variables";
    .box {
      @include scroll-bar();
      border-radius: $default-radius;
    }
</style>