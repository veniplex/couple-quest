<script>
	import { auth } from "$lib/firebase";
	import { signOut } from "firebase/auth";
	import { goto } from "$app/navigation";
	import { userStore } from "$lib/stores/userStore";

	async function handleSignOut() {
		try {
			await signOut(auth);
			goto("/"); // Redirect to the homepage after sign out
		} catch (error) {
			console.error("Error signing out:", error);
			// Optionally, handle errors, e.g., show an error message
		}
	}
</script>

<nav class="navbar">
	<div class="navbar-start">
		<div class="w-12">
			<img src="/couple-quest-logo.png" alt="Profile Photo" class="profile-photo" />
		</div>
	</div>
	<div class="navbar-center">
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/dashboard">Dashboard</a></li>
			</ul>
		</div>
	</div>
	<div class="navbar-end">
		<span class="pr-2 text-sm">{$userStore.userName}</span>
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img src={$userStore.userPhoto} alt="Profile Photo" class="profile-photo" />
				</div>
			</div>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box"
			>
				<li on:click={handleSignOut}><a>Abmelden</a></li>
			</ul>
		</div>
	</div>
</nav>
