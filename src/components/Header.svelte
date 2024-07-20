<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Menu from '@smui/menu';
	import List, { Item, Separator, Text } from '@smui/list';
	import chefkochLogo from '$lib/assets/chefkoch-logo.svg';
	import ChefkochImportDialog from './dialogs/ChefkochImportDialog.svelte';
	import { clearRecipeDraft } from '../stores/recipedraftstore';
	import { goto } from '$app/navigation';
	import { createError } from '../stores/errormessagestore';

	let user: string | null | undefined =
		$authStore.currentUser?.displayName || $authStore.currentUser?.email;

	async function logout() {
		try {
			await authHandlers.logout();
		} catch (err) {
			createError(err as Error);
		}
	}

	let userMenu: Menu;
	let importMenu: Menu;
	let showChefkochImportDialog = false;
</script>

<TopAppBar id="app-bar" variant="static" color="primary">
	<Row>
		<Section>
			<Title on:click={() => goto('/')}>THOC Cookbook</Title>
		</Section>
		<Section align="end" toolbar>
			<div>
				<Menu bind:this={importMenu} anchorCorner="BOTTOM_LEFT">
					<List>
						<Item disabled>
							<Text>Rezept importieren</Text>
						</Item>
						<Separator />
						<Item on:SMUI:action={() => (showChefkochImportDialog = true)}>
							<img class="chefkoch-icon mdc-button__icon" src={chefkochLogo} alt="chefkoch-logo" />
							<Text>chefkoch.de</Text>
						</Item>
					</List>
				</Menu>
				<IconButton
					class="material-icons"
					aria-label="Import"
					on:click={() => {
						clearRecipeDraft();
						goto('/addrecipe');
					}}>add</IconButton
				>
				<IconButton
					class="material-icons"
					aria-label="Import"
					on:click={() => importMenu.setOpen(true)}>input</IconButton
				>

				<IconButton class="material-icons" aria-label="User" on:click={() => userMenu.setOpen(true)}
					>person</IconButton
				>
			</div>
			<div id="anchor-right">
				<Menu bind:this={userMenu} anchorCorner="BOTTOM_LEFT">
					<List>
						<Item disabled>
							<Text>{user}</Text>
						</Item>
						<Separator />
						<Item on:SMUI:action={logout}>
							<Text>Logout</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</Section>
	</Row>
</TopAppBar>

<ChefkochImportDialog bind:open={showChefkochImportDialog} />

<style lang="scss">
	:global(.mdc-top-app-bar__title:hover) {
		cursor: pointer;
	}
</style>
