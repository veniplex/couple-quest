<script>
	import Navbar from "$lib/components/Navbar.svelte";
	import ShuffleDate from "$lib/components/ShuffleDate.svelte";
	import AddButton from "$lib/components/AddButton.svelte";
	import Footer from "$lib/components/Footer.svelte";
</script>

<main class="h-screen flex flex-col justify-between">
	<Navbar />
	<div class="h-full flex flex-col p-2 items-center justify-center">
		<ShuffleDate />
	</div>
	<div class="self-end pr-4 pb-4">
		<AddButton />
	</div>
	<Footer />
</main>
