<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';

	import { onMount } from 'svelte';
	import { object } from 'zod';
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

	function formatDate(dateString: string) {
		return dateString ? new Date(dateString).toLocaleDateString() : 'None';
	}
	
	let showCast = $state(false); // Add a variable to control the visibility of the cast list
</script>

<h1>{data.seriesName}</h1>

<h2>Genres</h2>
<ul>
	{#each data.genres as genre}
		<li>{genre.name}</li>
	{/each}
</ul>

<button onclick={() => (showCast = !showCast)} style="cursor: pointer">
	Cast
	{#if showCast}
		<span>&darr;</span>
	{:else}
		<span>&rarr;</span>
	{/if}
</button>
{#if showCast}
	<div class="cast-list">
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
	</div>
{/if}

<h2>Episodes</h2>
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
			<div class="episode-item">
				<h3>{episode.name}</h3>
				<p>Season {episode.season_number}, Episode {episode.episode_number}</p>
				<p>Air Date: {formatDate(episode.air_date!)}</p>
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

	

	.button-form {
		flex: 1;
	}

	.spinner-container {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	.cast-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
	}

	.actor-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
		padding: 5px 10px;
		border: 1px solid #ddd;
		border-radius: 1px;
		background-color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
	}

	.actor-info {
		flex-grow: 1;
		overflow: hidden;
	}

	.actor-info h3 {
		margin: 0;
		font-size: 0.9rem;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.actor-info p {
		margin: 2px 0 0 0;
		font-size: 0.8rem;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.actor-image {
		width: 50px;
		height: 50px;
		margin-left: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
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
</style>
