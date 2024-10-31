<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';
	import { Button } from "$lib/components/ui/button";	
	import Textfield from '@smui/textfield';
	import { createError } from '../stores/errormessagestore';

	let email = '';
	let password = '';

	async function handleSubmit() {
		if (!email || !password) {
			return;
		}

		const loginResult = await authHandlers.login(email, password).catch(createError);

		if (loginResult && loginResult.message) {
			createError(loginResult);
		} else if (!$authStore.currentUser) {
			createError('Login unsuccessful!');
		} else {
			window.location.href = '/';
		}
	}
</script>

<div class="container">
	<h3>Log in</h3>
	<div class="loginForm">
		<Textfield bind:value={email} label="Email" required type="email" />
		<Textfield bind:value={password} label="Password" required type="password" />
		<Button class="submitButton" on:click={handleSubmit}>Submit</Button>
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		place-items: center;
		align-items: center;
		align-content: center;
		justify-content: center;
		flex: 1;
		min-height: 80vh;

		.loginForm {
			display: flex;
			flex-direction: column;
			margin-top: 1rem;

			:global(.submitButton) {
				margin-top: 1rem;
			}
		}
	}
</style>
