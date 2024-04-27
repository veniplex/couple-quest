<script>
	import { db } from "$lib/firebase";
	import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
	import confetti from "canvas-confetti";

	let dateIdea = null;
	let loading = false;
	let error = null;
	let displayText = "";
	let isHome = false;
	let isOutdoor = false;
	let isFree = false;
	let isOnTheRoad = false;
	let isIndoor = false;

	async function fetchRandomDateIdea() {
		loading = true;
		try {
			let q = collection(db, "dateIdeas");
			let conditions = [];

			// Nur Ideen, die noch nicht als "done" markiert sind
			conditions.push(where("done", "==", false));

			if (isHome && !isOnTheRoad) {
				conditions.push(where("canBeDoneAtHome", "==", true));
			} else if (!isHome && isOnTheRoad) {
				conditions.push(where("canBeDoneAtHome", "==", false));
			}

			if (isOutdoor && !isIndoor) {
				conditions.push(where("isOutdoor", "==", true));
			} else if (!isOutdoor && isIndoor) {
				conditions.push(where("isOutdoor", "==", false));
			}

			if (isFree) {
				conditions.push(where("costsMoney", "==", false));
			}

			// Erstelle eine kombinierte Abfrage mit allen Bedingungen
			for (let condition of conditions) {
				q = query(q, condition);
			}

			const querySnapshot = await getDocs(q);
			const ideas = [];
			querySnapshot.forEach((doc) => {
				ideas.push({ ...doc.data(), id: doc.id });
			});

			if (ideas.length > 0) {
				animateIdeas(ideas);
			} else {
				dateIdea = null;
				error = "Du musst erst ein paar Ideen eintragen :(!";
				loading = false;
			}
		} catch (err) {
			console.error("Fehler beim Abrufen der Date-Ideen: ", err);
			error = "Fehler beim Laden der Daten.";
			loading = false;
		}
	}

	function fireConfetti() {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			duration: 1000 // Dauer der Animation in Millisekunden
		});
	}

	function animateIdeas(ideas) {
		let count = 0;
		const totalDuration = 5000; // Gesamtdauer der Animation in ms
		let elapsed = 0; // Verstrichene Zeit
		let intervalTime = 10; // Startintervall in ms

		const timer = () => {
			if (ideas.length > 1) {
				displayText = ideas[Math.floor(Math.random() * ideas.length)].title;
			} else {
				// Wenn nur eine Idee vorhanden ist
				displayText = count % 2 === 0 ? ideas[0].title : "Zum Mars fliegen";
			}

			count++;
			elapsed += intervalTime;
			intervalTime = intervalTime * 1.1; // Erhöhe das Intervall um 10%

			if (elapsed < totalDuration) {
				setTimeout(timer, intervalTime);
			} else {
				clearInterval();
				dateIdea = ideas[Math.floor(Math.random() * ideas.length)];
				displayText = dateIdea.title;
				loading = false;
				fireConfetti(); // Löse die Konfetti-Animation aus
			}
		};

		timer(); // Starte die Animation
	}

	async function markAsDone() {
		if (!dateIdea) {
			console.error("Keine Date-Idee verfügbar zum Markieren.");
			return;
		}

		const ideaRef = doc(db, "dateIdeas", dateIdea.id); // Referenz zum Firestore-Dokument
		try {
			document.getElementById("markAsDoneButton").disabled = true;
			await updateDoc(ideaRef, {
				done: true
			});
			console.log("Date-Idee als erledigt markiert.");
			// Optional: Aktualisieren der UI oder erneutes Fetchen der Date-Ideen
		} catch (err) {
			console.error("Fehler beim Aktualisieren des Dokuments: ", err);
			error = "Fehler beim Markieren der Date-Idee als erledigt.";
		}
	}
</script>

<!-- Display date idea and shuffle animation -->
{#if loading || dateIdea || error}
	<div class="py-40">
		{#if loading}
			<p class="text-3xl text-neutral">{displayText}</p>
			<!-- This updates during the animation -->
		{:else if dateIdea}
			<h3 class="text-6xl font-bold text-neutral">{dateIdea.title}</h3>
			<!-- Optionally show more details here -->
		{:else if error}
			<p class="text-3xl text-error">{error}</p>
		{/if}
	</div>
{/if}

<!-- Generate date idea button -->
<button
	class="btn btn-lg btn-primary"
	on:click={fetchRandomDateIdea}
	disabled={loading ? true : false}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="pink"
		stroke="pink"
		viewBox="0 -960 960 960"
		><path
			d="m480-154-38-36q-106-99-173-166.5T164.5-473q-37.5-49-51-88.5T100-642q0-82 57.5-139T298-838q49 0 96 26t86 76q39-50 86-76t96-26q83 0 140.5 57T860-642q0 41-13.5 80.5t-51 88.5q-37.5 49-104 116.5T518-190l-38 36Z"
		/></svg
	>
	{#if dateIdea}
		Andere Idee generieren
	{:else}
		Date-Idee generieren
	{/if}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="pink"
		stroke="pink"
		viewBox="0 -960 960 960"
		><path
			d="m480-154-38-36q-106-99-173-166.5T164.5-473q-37.5-49-51-88.5T100-642q0-82 57.5-139T298-838q49 0 96 26t86 76q39-50 86-76t96-26q83 0 140.5 57T860-642q0 41-13.5 80.5t-51 88.5q-37.5 49-104 116.5T518-190l-38 36Z"
		/></svg
	>
</button>

<!-- Mark as done button -->
{#if dateIdea}
	<button
		id="markAsDoneButton"
		class="btn btn-md my-2 btn-accent"
		disabled={loading ? true : false}
		on:click={markAsDone}>Als erledigt markieren</button
	>
{/if}

<!-- Filter -->
<div class="flex mt-2">
	<div class="form-control">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={isFree}
				disabled={loading ? true : false}
			/>
			<span class="label-text pl-2">Kostenlos</span>
		</label>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={isHome}
				disabled={loading ? true : false}
			/>
			<span class="label-text pl-2">Zuhause</span>
		</label>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={isOnTheRoad}
				disabled={loading ? true : false}
			/>
			<span class="label-text pl-2">Unterwegs</span>
		</label>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={isOutdoor}
				disabled={loading ? true : false}
			/>
			<span class="label-text pl-2">Im Freien</span>
		</label>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={isIndoor}
				disabled={loading ? true : false}
			/>
			<span class="label-text pl-2">Drinnen</span>
		</label>
	</div>
</div>
