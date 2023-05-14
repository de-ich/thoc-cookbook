<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';

	let email: string | null | undefined = '';
	authStore.subscribe((curr) => {
		email = curr?.currentUser?.email;
	});

	async function logout() {
		try {
			await authHandlers.logout();
		} catch (err) {
			console.log(err);
		}
	}
</script>

<div class="header">
	<h1>current user : {email}</h1>
	<button on:click={logout}>Log out</button>
</div>
<div class="separator">

</div>

<style lang="scss">
	.header {
		height: 60px;
		display: flex;
		flex-direction: row;
		align-items: center;

		& > * {
			margin: 0 10px 0 0;
		}

		h1 {
			margin-left: auto;
		}
	}

    .separator {
        height: 20px;
        background-color: lightgrey;
    }
</style>
