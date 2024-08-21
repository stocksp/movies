<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  
	let searchTerm = '';
	let actors = [];
	
	async function searchActors() {
	  console.log('Searching for:', searchTerm.toString());
	  if (searchTerm.length >= 3) {
		const response = await fetch(`/api/actors?search=${encodeURIComponent(searchTerm)}`);
		if (response.ok) {
		  actors = await response.json();
		  console.log('Fetched actors:', actors);
		} else {
		  console.error('Error fetching actors:', response.statusText);
		  actors = [];
		}
	  } else {
		actors = [];
	  }
	}
  
	/**
	 * @param {number} id
	 */
	function navigateToActor(id) {
	  goto(`/actor/${id}`);
	}
  
	// This reactive statement will call searchActors whenever searchTerm changes
	$: {
	  searchActors();
	}
  </script>
  
  <main>
	<h1>Actor Search</h1>
	<input
	  type="text"
	  bind:value={searchTerm}
	  placeholder="Enter actor name"
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
	{:else}
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
  
	button:hover, button:focus {
	  background-color: #f0f0f0;
	  outline: none;
	}
  </style>
  