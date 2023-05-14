<script>
	import { authHandlers, authStore } from "../stores/authstore";

    let email = '';
    let password = '';

    async function handleSubmit () {
        if (!email || !password) {
            return;
        }

        try {
            await authHandlers.login(email, password);
        } catch (err) {
            console.log(err);
        }

        if ($authStore.currentUser) {
            window.location.href = '/';
        }
    }
</script>

<div class="container">
	<h1>Log in</h1>
	<form>
		<label>
			<input bind:value={email} type="email" placeholder="Email" />
		</label>
		<label>
			<input bind:value={password} type="password" placeholder="Password" />
		</label>
        <button on:click={handleSubmit}>Submit</button>
	</form>
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		align-items: center;
        align-content: center;
		justify-content: center;
		flex: 1;
	}
 
    .container form {
        display: flex;
        flex-direction: column;
    }
</style>
