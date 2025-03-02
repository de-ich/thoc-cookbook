<script lang="ts">
	import { authHandlers, authStore } from '$lib/stores/authstore';
	import { Button } from '$lib/shadcn/button';
	import { createError } from '$lib/stores/errormessagestore';
	import { Input } from '$lib/shadcn/input';

	let email = $state('');
	let password = $state('');

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
	class="fixed top-1/2 left-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-8"
>
	<h2>Log in</h2>
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
		<Button class="self-stretch" onclick={handleSubmit}>Submit</Button>
	</div>
</div>
