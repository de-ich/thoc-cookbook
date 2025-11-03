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
        
        (async () => {
            recipeUrl = await getResizedImageAsDataUrl(file);
            console.log("Resized image data URL:", recipeUrl);
        })();
    });

    const MAX_IMAGE_SIZE = 1000; // Maximum width or height in pixels (larger images will be resized)

    const getResizedImageAsDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const originalImageDataUrl = e.target?.result as string;
                const img = new Image();
                img.onload = () => {

                    // Get original image dimensions
                    let width = img.width;
                    let height = img.height;

                    if (width <= MAX_IMAGE_SIZE && height <= MAX_IMAGE_SIZE) {
                        // No resizing needed
                        resolve(originalImageDataUrl);
                        console.log("No resizing needed for image.");
                        return;
                    }
                    
                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_IMAGE_SIZE) {
                            height = height * (MAX_IMAGE_SIZE / width);
                            width = MAX_IMAGE_SIZE;
                        }
                    } else {
                        if (height > MAX_IMAGE_SIZE) {
                            width = width * (MAX_IMAGE_SIZE / height);
                            height = MAX_IMAGE_SIZE;
                        }
                    }

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the resized image
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Get the data URL of the resized image
                    const dataUrl = canvas.toDataURL("image/png");
                    resolve(dataUrl);
                };
                img.src = originalImageDataUrl;
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };
</script>

<Input
    inputId="recipeFile"
    type="file"
    bind:files={recipeImageFiles}
    label="Rezeptbild (Datei)"
    placeholder="Rezeptbild (Datei)"
    accept="image/*;capture=camera"
/>