<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '../lib/firebase/firebase.client';
	import { authStore } from '../stores/authstore';
	import { browser } from '$app/environment';
	import Header from '$lib/components/ui/header';
	import Loading from '../components/Loading.svelte';
	import { LOGIN_PAGE_ROUTE } from './routes';
	import ErrorDialog from '../components/ErrorDialog.svelte';

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
	<div class="mainContainer">
		<slot />
	</div>
{/if}

<ErrorDialog />

<style lang="scss">
	.mainContainer {
		max-width: 70rem;
		padding-left: 2rem;
		padding-right: 2rem;
		margin-left: auto;
		margin-right: auto;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}
</style>
