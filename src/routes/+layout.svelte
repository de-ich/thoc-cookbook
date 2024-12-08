<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '../lib/firebase/firebase.client';
	import { authStore } from '$lib/stores/authstore';
	import { browser } from '$app/environment';
	import Header from '$lib/components/header';
	import Loading from '$lib/components/loading';
	import { LOGIN_PAGE_ROUTE } from './routes';
	import ErrorDialog from '$lib/dialogs/error-dialog';
	import { ModeWatcher } from 'mode-watcher';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.update((curr) => {
				return { ...curr, isLoading: false, currentUser: user };
			});

			if (
				browser &&
				!$authStore.currentUser &&
				!$authStore.isLoading &&
				window.location.pathname !== LOGIN_PAGE_ROUTE
			) {
				window.location.href = LOGIN_PAGE_ROUTE;
			}
		});

		return unsubscribe;
	});
</script>

<!-- Used to toggle between light and dark mode-->
<ModeWatcher />

{#if $authStore?.currentUser}
	<Header />
{/if}

{#if !$authStore || $authStore.isLoading}
	<Loading />
{:else}
	<div class="mx-auto mb-8 mt-4 max-w-6xl px-8">
		<slot />
	</div>
{/if}

<ErrorDialog />
