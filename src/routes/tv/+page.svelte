<script lang="ts">
	
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	
	let name: string = $state('');

	/** @type {string[]} */
	let selectedGenres: string[] = $state([]);

	/** @type {string} */
	let genrecount: string = $state('');

	let { data }: { data: PageData } = $props();
	let genres: string[] = $state([])

	
	$effect(() => {
		genres = data.genre.map(g => g.name);
	})




	/**
	 * Handles the form submission
	 * @param {Event} event
	 */
	function handleSubmit(event: Event) {
		event.preventDefault();
		const params = new URLSearchParams();
		params.append('name', name);
		genrecount = selectedGenres.length.toString();
		params.append('genrecount', genrecount.toString());
		selectedGenres.forEach((genre) => params.append('genres', genre));
		goto(`/tv_search?${params.toString()}`);
	}
	
//	console.log('Genre', data.genre[0].name);

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
		  placeholder="Enter a TV show name" 
		  bind:value={name}
		  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
		/>
	  </div>
	  <div>
		<label for="genre" class="block text-sm font-medium text-gray-700">Choose a Genre:</label>
		<select 
		  name="genre" 
		  id="genre" 
		  multiple 
		  bind:value={selectedGenres}
		  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
		  <option value="" disabled class="text-gray-400">--Choose a Genre--</option>
		  {#each data.genre as genre}
			<option value={genre.id}>{genre.name}</option>
		  {/each}
		</select>
	  </div>
	  <button 
		type="submit" 
		class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
	  >
		Retrieve TV Shows
	  </button>
	</form>
  </div>
