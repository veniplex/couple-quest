<script>
	import { onMount } from "svelte";
	import { auth } from "$lib/firebase";
	import { userStore } from "$lib/stores/userStore";
	import { goto } from "$app/navigation";

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userStore.update((current) => ({
					...current,
					userPhoto: user.photoURL,
					userName: user.displayName || user.email,
					isLoading: false
				}));
			} else {
				goto("/");
			}
		});
	});
</script>

{#if $userStore.isLoading}
	<div class="m-auto h-screen flex justify-center">
		<span class="loading loading-dots loading-lg"></span>
	</div>
{:else}
	<slot />
{/if}
