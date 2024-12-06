<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '../lib/firebase/firebase.client';
	import { authStore } from '../stores/authstore';
	import { browser } from '$app/environment';
	import Header from '$lib/components/ui/header';
	import Loading from '../components/Loading.svelte';
	import { LOGIN_PAGE_ROUTE } from './routes';
	import ErrorDialog from '$lib/components/ui/error-dialog';

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

{#if $authStore?.currentUser}
	<Header />
{/if}

{#if !$authStore || $authStore.isLoading}
	<Loading />
{:else}
	<div class="max-w-6xl px-8 mx-auto mt-4 mb-8">
		<slot />
	</div>
{/if}

<ErrorDialog />
