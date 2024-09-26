<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let name: string = $state('');

	let selectedGenres: string[] = $state([]);
	let genrecount = '';
	
	let {
		data
	}: {
		data: PageData;
	} = $props();

	
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const params = new URLSearchParams();
		params.append('name', name);
		genrecount = selectedGenres.length.toString();
		params.append('genrecount', genrecount.toString());
		selectedGenres.forEach((genre) => params.append('genres', genre));
		goto(`/search?${params.toString()}`);
	}
	
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap's movies" />
</svelte:head>

<div class="container mx-auto p-4">
	<form onsubmit={handleSubmit} class="space-y-4">
		<div>
			<input 
				type="text" 
				name="name" 
				placeholder="Enter a movie name" 
				bind:value={name}
				class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" 
			/>
		</div>
		<div>
			<label for="genra" class="block text-gray-700">Choose a Genre:</label>
			<select 
				name="genra" 
				id="genra" 
				multiple 
				bind:value={selectedGenres}
				class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
			>
				<option value="" disabled class="text-gray-400">--Choose a Genre--</option>
				{#each data.genre as genre}
					<option value={genre.id}>{genre.name}</option>
				{/each}
			</select>
		</div>
		<button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
			Retrieve Movies
		</button>
	</form>
</div>