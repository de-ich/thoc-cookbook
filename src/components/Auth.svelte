<script lang="ts">
	import { authHandlers, authStore } from '../stores/authstore';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import { createError } from '../stores/errormessagestore';

	let email = '';
	let password = '';

	async function handleSubmit() {
		if (!email || !password) {
			return;
		}

		const loginResult = await authHandlers.login(email, password).catch(createError);

		if (loginResult) {
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
	<form>
		<Textfield bind:value={email} label="Email" required type="email" />
		<Textfield bind:value={password} label="Password" required type="password" />
		<Button class="submitButton" on:click={handleSubmit} variant="unelevated">Submit</Button>
	</form>
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

		form {
			display: flex;
			flex-direction: column;
			margin-top: 1rem;

			:global(.submitButton) {
				margin-top: 1rem;
			}
		}
	}
</style>
