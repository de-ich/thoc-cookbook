<script lang="ts">
	import { Input } from "$lib/shadcn/input";

    export type Props = {
		recipeUrl?: string;
	};

	let { recipeUrl = $bindable()  }: Props = $props();
    let recipeImageFiles: FileList | undefined = $state(undefined);

    $effect(() => {
        if (!recipeImageFiles || recipeImageFiles.length === 0) {
            recipeUrl = undefined;
            return;
        }
        
        const file = recipeImageFiles[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            recipeUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
</script>

<Input
    inputId="recipeFile"
    type="file"
    bind:files={recipeImageFiles}
    label="Rezeptbild (Datei)"
    placeholder="Rezeptbild (Datei)"
    accept="image/*"
    multiple={false}
/>