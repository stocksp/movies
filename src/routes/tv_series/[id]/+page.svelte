<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';

	import { onMount } from 'svelte';
	import { object } from 'zod';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	let { data }: { data: PageData } = $props();

	let debugInfo = $state('');

	function addDebugInfo(info: string) {
		debugInfo += info + '\n';
		console.log(info);
	}

	let isLoading = $state(false);

	async function changeSeason() {
		const seasonSelect = document.getElementById('season-select') as HTMLSelectElement; // Non-null assertion
		const season = seasonSelect.value;
		addDebugInfo(`Changing season to: ${season}`);
		try {
			await goto(`?season=${season}`, { replaceState: true });
			//addDebugInfo(`URL updated to: ${window.location.href}`);
		} catch (error) {
			console.log('Wow an error happende');
			//addDebugInfo(`Error updating URL: ${error.message}`);
		}
	}

	function navigateToActor(id: number) {
		goto(`/actor/${id}`);
	}

	let showCast = $state(false); // Add a variable to control the visibility of the cast list
</script>

<p class="text-3xl font-bold">{data.seriesName}</p>

<p class="font-bold pt-1 pb-1">Genres</p>
<ul>
	{#if data.genres}
		{#each data.genres as genre}
			<li class="list-disc list-inside indent-2">{genre.name}</li>
		{/each}
	{:else}
		<li>No genres found.</li>
	{/if}
</ul>

<button onclick={() => (showCast = !showCast)} class="left-align" style="cursor: pointer">
	<span class="font-bold pt-1 pb-1">Cast</span>
	{#if showCast}
		<span style="color: red">&darr;</span>
	{:else}
		<span style="color: red">&rarr;</span>
	{/if}
</button>
{#if showCast}
	<div class="flex-container">
		{#if data.cast}
			{#each data.cast as actor}
				<div class="flex-item">
					<div class="grid-container">
						<div class="actor font-bold">{actor.name}</div>
						<div class="picture flex justify-center">
							{#if actor.picture}
								<img
									src="data:image/jpeg;base64,{actor.picture}"
									alt={actor.name}
									class="w-auto object-contain"
								/>
							{:else}
								<div class="placeholder-image"></div>
							{/if}
						</div>
						<div class="character truncate">as {actor.character}</div>
						<div class="details">
							<Button
								variant="outline"
								class="w-full bg-emerald-300"
								style="width: 120px"
								on:click={() => navigateToActor(actor.id)}
							>
								View Details
							</Button>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p>No cast information available.</p>
		{/if}
	</div>
	<!-- 	<div class="cast-list">
		{#each data.cast as actor}
			<a
				href="/actor/{actor.id}"
				class="actor-card"
				onclick={(e) => {
					e.preventDefault();
					navigateToActor(actor.id);
				}}
			>
				<div class="actor-info">
					<h3>{actor.name}</h3>
					<p>as {actor.character}</p>
				</div>
				<div class="actor-image">
					{#if actor.picture}
						<img src="data:image/jpeg;base64,{actor.picture}" alt={actor.name} />
					{:else}
						<div class="placeholder-image"></div>
					{/if}
				</div>
			</a>
		{/each}
	</div> -->
{/if}

<p class="font-bold pt-1 pb-1">Episodes</p>
{#if data.season_list.length > 1}
	<div class="season-selector">
		<label for="season-select">Season:</label>
		<select id="season-select" onchange={changeSeason}>
			{#each data.season_list as season}
				<option value={season.season_number} selected={season.season_number === data.season}>
					Season {season.season_number}
				</option>
			{/each}
		</select>
	</div>
{/if}

{#if isLoading}
	<div>loading ...</div>
{:else}
	<div class="episode-list">
		{#each data.movieDetails as episode}
			<div class="episode-item" style="background-color:rgb(251,249,233)">
				<h3>{episode.name}</h3>
				<p>Season {episode.season_number}, Episode {episode.episode_number}</p>
				<p>Air Date: {episode.air_date.toLocaleDateString(
					'en-US',
					{ year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }
				)}</p>
				<p>{episode.overview}</p>
			</div>
		{/each}
	</div>
{/if}

<style>
	.episode-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
	}

	.episode-item {
		background-color: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 15px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.episode-item h3 {
		color: #2438eb;
		font-size: 20px;
	}

	.episode-item p {
		margin: 1px 0;
		color: #142764;
	}

	.actor-image img,
	.placeholder-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 5px;
	}

	.placeholder-image {
		background-color: #ddd;
	}

	@media screen and (max-width: 390px) {
		.actor-card {
			height: 50px;
		}

		.actor-image {
			width: 40px;
			height: 40px;
		}

		.actor-info h3 {
			font-size: 0.8rem;
		}

		.actor-info p {
			font-size: 0.7rem;
		}
	}
	.left-align {
		display: block;
		text-align: left;
	}

	/* Below is for the cast list */
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-left: 40px;
		justify-content: flex-start;
	}

	.flex-item {
		width: 300px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 1024px) {
		.flex-container {
			flex-direction: row;
		}
	}

	@media (max-width: 800px) {
		.flex-container {
			flex-direction: row;
		}
	}

	@media (max-width: 640px) {
		.flex-container {
			flex-direction: column;
		}
	}
	.actor {
		grid-area: actor;
		height: 24px;
		width: 280px;
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.picture {
		grid-area: picture;
		height: 100px;
		width: 92px;
	}
	.character {
		grid-area: character;
		width: 188px;
	}
	.details {
		grid-area: details;
		width: 188px;
	}

	.grid-container {
		display: grid;
		grid-template-areas:
			'actor actor actor actor'
			'picture picture character character'
			'picture picture details details';
		padding: 2px;
	}

	.grid-container > div {
		background-color: rgba(175, 162, 63, 0.8);
		text-align: center;
		padding: 1px 0;
	}
</style>
