<script>
	import { onMount } from "svelte";
	import { auth, GoogleAuthProvider } from "$lib/firebase";
	import { signInWithRedirect, getRedirectResult } from "firebase/auth";
	import { goto } from "$app/navigation";

	function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		signInWithRedirect(auth, provider);
	}

	onMount(async () => {
		const result = await getRedirectResult(auth);
		if (result) {
			goto("/dashboard");
		} else {
			auth.onAuthStateChanged((user) => {
				if (user) {
					goto("/dashboard");
				}
			});
		}
	});
</script>

<div class="flex flex-col m-auto h-fit w-fit justify-center items-center bg-green-50">
	<img src="/couple-quest-logo.png" class="" alt="Couple Quest Logo" />
	<button class="btn btn-primary sm:btn-wide btn-md sm:btn-lg" on:click={loginWithGoogle}
		>Mit Google anmelden</button
	>
</div>
