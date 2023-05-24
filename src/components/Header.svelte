<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Menu from '@smui/menu';
	import type { Nullable } from 'vitest';
	import List, { Item, Separator, Text } from '@smui/list';

	let user: Nullable<string> = null;
	authStore.subscribe((curr) => {
		user = curr?.currentUser?.displayName || curr?.currentUser?.email;
	});

	async function logout() {
		try {
			await authHandlers.logout();
		} catch (err) {
			console.log(err);
		}
	}

	let menu: Menu;
</script>

<TopAppBar id="app-bar" variant="static" color="primary">
	<Row>
		<Section>
			<Title>THOC Cookbook</Title>
		</Section>
		<Section align="end" toolbar>
			<div>
				<IconButton class="material-icons" aria-label="User" on:click={() => menu.setOpen(true)}
					>person</IconButton
				>
			</div>
			<div id="anchor-right">
				<Menu bind:this={menu} anchorCorner="BOTTOM_LEFT">
					<List>
						<Item disabled>
							<Text>{user}</Text>
						</Item>
						<Separator />
						<Item>
							<Text on:click={logout}>Logout</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</Section>
	</Row>
</TopAppBar>
