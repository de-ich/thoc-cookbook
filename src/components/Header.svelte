<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		SkipToContent,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import type { User } from 'firebase/auth';
	import type { Nullable } from 'vitest';

	let user: Nullable<User> = null;
	authStore.subscribe((curr) => {
		user = curr?.currentUser;
	});

	async function logout() {
		try {
			await authHandlers.logout();
		} catch (err) {
			console.log(err);
		}
	}

	let isUserHeaderActionOpen = false;
</script>

<Header company="THOC" platformName="Cookbook">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust} />
		<HeaderAction
			bind:isOpen={isUserHeaderActionOpen}
			icon={UserAvatarFilledAlt}
			closeIcon={UserAvatarFilledAlt}
		>
			<HeaderPanelLinks>
				<HeaderPanelDivider>{user?.displayName || user?.email}</HeaderPanelDivider>
				<HeaderPanelLink on:click={logout}>Logout</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
