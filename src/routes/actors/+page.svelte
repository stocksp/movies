<script>
	import { goto } from '$app/navigation';

	let searchTerm = '';
	let actors = [];
	let fullWildcard = false;

	$: if (searchTerm.length >= 3) {
		searchActors();
	} else {
		actors = [];
	}

	async function searchActors() {
		console.log('Searching for:', searchTerm, 'with fullWildcard:', fullWildcard);

		const response = await fetch(
			`/api/actors?search=${encodeURIComponent(searchTerm)}&fullWildcard=${fullWildcard}`
		);

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

<svelte:head>
	<title>Actor Search</title>
</svelte:head>

<main>
	<h1>Actor Search</h1>
	<div class="input-group">
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Enter actor name"
			on:input={() => console.log('Current input:', searchTerm)}
		/>
		<label class="checkbox-container">
			<input
				type="checkbox"
				bind:checked={fullWildcard}
				on:change={() => searchTerm.length >= 3 && searchActors()}
			/>
			Full Wildcard
		</label>
	</div>

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

	.input-group {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	input[type='text'] {
		flex-grow: 1;
		padding: 10px;
		font-size: 16px;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
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
		padding: 5px;
		font-size: 16px;
		border-bottom: 1px solid #ccc;
	}
</style>
