<script>
	import { onMount } from "svelte";
	import { auth, GoogleAuthProvider } from "$lib/firebase";
	import { signInWithRedirect, signInWithPopup } from "firebase/auth";
	import { goto } from "$app/navigation";

	// SignInWithRedirect method (deprecated)
	// function loginWithGoogle() {
	// 	const provider = new GoogleAuthProvider();
	// 	signInWithRedirect(auth, provider);
	// }

	// onMount(async () => {
	// 	const result = await getRedirectResult(auth);
	// 	if (result) {
	// 		goto("/dashboard");
	// 	} else {
	// 		auth.onAuthStateChanged((user) => {
	// 			if (user) {
	// 				goto("/dashboard");
	// 			}
	// 		});
	// 	}
	// });

	// SignInWithPopup (not working on mobile)
	async function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credentials = await signInWithPopup(auth, provider);
		if (credentials) {
			goto("/dashboard");
		} else {
			auth.onAuthStateChanged((user) => {
				if (user) {
					goto("/dashboard");
				}
			});
		}
	}
</script>

<div class="flex flex-col m-auto h-fit w-fit justify-center items-center">
	<img src="/couple-quest-logo.png" class="max-w-screen-sm" alt="Couple Quest Logo" />
	<button class="btn btn-primary sm:btn-wide btn-md sm:btn-lg" on:click={loginWithGoogle}
		>Mit Google anmelden</button
	>
</div>
