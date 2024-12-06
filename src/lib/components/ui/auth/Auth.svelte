<script lang="ts">
	import { authHandlers, authStore } from '../../../../stores/authstore';
	import { Button } from '$lib/components/ui/button';
	import { createError } from '../../../../stores/errormessagestore';
	import { Input } from '$lib/components/ui/input';

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

<div
	class="fixed left-1/2 top-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center"
>
	<h1>Log in</h1>
	<div class="flex flex-col gap-4">
		<Input
			bind:value={email}
			label="Email"
			placeholder="Email"
			required
			type="email"
			inputId="email"
		/>
		<Input
			bind:value={password}
			label="Password"
			placeholder="Password"
			required
			type="password"
			inputId="password"
		/>
		<Button class="self-stretch" on:click={handleSubmit}>Submit</Button>
	</div>
</div>
