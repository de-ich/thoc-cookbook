<script>
	import { onMount } from 'svelte';
	import { auth } from '../lib/firebase/firebase.client';
	import { authStore } from '../stores/authstore';
	import { browser } from '$app/environment';
	import Header from '../components/Header.svelte';
	import { page } from '$app/stores';
	import Loading from '../components/Loading.svelte';

	const LOGIN_PAGE_ROUTE = '/login';

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

<main class="mainContainer">
	{#if $page.url.pathname === LOGIN_PAGE_ROUTE}
		<slot />
	{:else if !$authStore || $authStore.isLoading}
		<Loading />
	{:else}
		<Header />
		<slot />
	{/if}
</main>

<style>
	.mainContainer {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
