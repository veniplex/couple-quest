<script>
	import { db } from "$lib/firebase";
	import { collection, addDoc } from "firebase/firestore";

	let title = "";
	let description = "";
	let canBeDoneAtHome = false;
	let isOutdoor = false;
	let costsMoney = false;

	async function saveDateIdea() {
		try {
			await addDoc(collection(db, "dateIdeas"), {
				title,
				description,
				canBeDoneAtHome,
				isOutdoor,
				costsMoney,
				done: false,
				timestamp: new Date() // Optional: add a timestamp if you need it
			});
			console.log("Date idea added!");
			document.getElementById("modal1").close();
			// Reset form fields
			title = "";
			description = "";
			canBeDoneAtHome = false;
			isOutdoor = false;
			costsMoney = false;
		} catch (err) {
			console.error("Error adding document: ", err);
		}
	}
</script>

<button class="btn btn-circle btn-lg btn-neutral" on:click={() => modal1.showModal()}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="currentColor"
		stroke="currentColor"
		viewBox="0 -960 960 960"
		><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
	>
</button>

<dialog id="modal1" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Date-Idee hinzufügen</h3>

		<form class="flex flex-col">
			<!-- Title -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Titel</span>
				</div>
				<input
					type="text"
					placeholder="Kino"
					class="input input-bordered w-full"
					bind:value={title}
				/>
			</label>
			<!-- Description -->
			<label class="form-control">
				<div class="label">
					<span class="label-text">Kurzbeschreibung</span>
				</div>
				<textarea
					class="textarea textarea-bordered h-24"
					placeholder="Ins Kino gehen und einen schönen Film anschauen."
					bind:value={description}
				></textarea>
			</label>
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">Kann Zuhause gemacht werden</span>
					<input type="checkbox" class="toggle" bind:checked={canBeDoneAtHome} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">Findet draußen statt</span>
					<input type="checkbox" class="toggle" bind:checked={isOutdoor} />
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">Kostet Geld</span>
					<input type="checkbox" class="toggle" bind:checked={costsMoney} />
				</label>
			</div>
			<button class="btn btn-primary" on:click={saveDateIdea}>Date-Idee speichern</button>
		</form>

		<p class="py-4 text-sm">Drücke <kbd class="kbd">ESC</kbd> zum abbrechen.</p>

		<!-- <div class="modal-action">
			<form method="dialog">
				<button class="btn">Abbrechen</button>
			</form>
		</div> -->
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
