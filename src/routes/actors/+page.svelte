<script>
	import { goto } from '$app/navigation';

	let searchTerm = '';
	let actors = [];

	// Watch for changes in searchTerm and call searchActors accordingly.
	$: if (searchTerm.length >= 3) {
		searchActors();
	} else {
		actors = [];
	}

	async function searchActors() {
		console.log('Searching for:', searchTerm);  // Log the current searchTerm

		const response = await fetch(`/api/actors?search=${encodeURIComponent(searchTerm)}`);
		
		if (response.ok) {
			actors = await response.json();
			console.log('Fetched actors:', actors);
		} else {
			console.error('Error fetching actors:', response.statusText);
			actors = [];
		}
	}

	function navigateToActor(id) {
		goto(`/actor/${id}`);
	}
</script>

<main>
	<h1>Actor Search</h1>
	<input
		type="text"
		bind:value={searchTerm}
		placeholder="Enter actor name"
		on:input={() => console.log('Current input:', searchTerm)}
	/>

	{#if actors.length > 0}
		<ul>
			{#each actors as actor}
				<li>
					<button on:click={() => navigateToActor(actor.id)}>
						{actor.name}
					</button>
				</li>
			{/each}
		</ul>
	{:else if searchTerm.length >= 3}
		<p>No results found</p>
	{/if}
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
	}

	input {
		width: 100%;
		padding: 10px;
		font-size: 16px;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 5px;
	}

	button {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		padding: 10px;
		font-size: 16px;
		border-bottom: 1px solid #ccc;
	}
</style>
