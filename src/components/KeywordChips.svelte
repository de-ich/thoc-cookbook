<script lang="ts">
    import Chip, { Set, TrailingAction, Text } from '@smui/chips';

    export let selectedKeywords: string[] = [];
</script>


<Set style="display: inline-block;" bind:chips={selectedKeywords} let:chip>
    <Chip {chip}>
        <Text tabindex={0}>{chip}</Text>
        <TrailingAction icon$class="material-icons">cancel</TrailingAction>
    </Chip>
</Set>
