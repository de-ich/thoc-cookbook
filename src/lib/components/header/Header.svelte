<script lang="ts">
	import Button from '$lib/shadcn/button/button.svelte';
	import * as DropdownMenu from '$lib/shadcn/dropdown-menu/index.js';
	import { IconButton } from '$lib/components/icon-button';
	import TopAppBar from '$lib/components/top-app-bar';

	import Plus from 'lucide-svelte/icons/plus';
	import Import from 'lucide-svelte/icons/import';
	import User from 'lucide-svelte/icons/user';
	import Logout from 'lucide-svelte/icons/log-out';

	import chefkochLogo from '$lib/assets/chefkoch-logo.svg';

	import { authHandlers, authStore } from '$lib/stores/authstore';
	import { clearRecipeDraft } from '$lib/stores/recipedraftstore';
	import { createError } from '$lib/stores/errormessagestore';

	import ChefkochImportDialog from '$lib/dialogs/chefkoch-import-dialog';
	import AiImportDialog from '$lib/dialogs/ai-import-dialog';
	import Bot from 'lucide-svelte/icons/bot';

	import { goto } from '$app/navigation';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';

	let user: string | null | undefined =
		$authStore.currentUser?.displayName || $authStore.currentUser?.email;

	async function logout() {
		try {
			await authHandlers.logout();
		} catch (err) {
			createError(err as Error);
		}
	}

	let showChefkochImportDialog = false;
	let showAiImportDialog = false;
</script>

<TopAppBar>
	<Button variant="ghost" on:click={() => goto('/')} class="text-xl hover:bg-inherit"
		>THOC Cookbook</Button
	>
	<div class="ml-auto">
		<IconButton
			on:click={() => {
				clearRecipeDraft();
				goto('/addrecipe');
			}}
		>
			<Plus class="h-4 w-4" />
		</IconButton>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<IconButton builders={[builder]}><Import class="h-4 w-4" /></IconButton>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Label>Rezept importieren</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={() => (showChefkochImportDialog = true)}>
					<img class="mr-2 h-4 w-4" src={chefkochLogo} alt="chefkoch-logo" />
					<span>chefkoch.de</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => (showAiImportDialog = true)}>
					<Bot class="mr-2 h-4 w-4" />
					<span>AI</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Button on:click={toggleMode} variant="ghost" size="icon">
			<Sun class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon
				class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
		</Button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<IconButton builders={[builder]}><User class="h-4 w-4" /></IconButton>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Label>{user}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={logout}>
					<Logout class="mr-2 h-4 w-4" />
					<span>Logout</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</TopAppBar>

<ChefkochImportDialog bind:open={showChefkochImportDialog} />
<AiImportDialog bind:open={showAiImportDialog} />
