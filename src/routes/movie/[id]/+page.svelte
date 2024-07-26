<script>
	import { goto } from '$app/navigation';
	import { Spinner, Button } from '@sveltestrap/sveltestrap';
	import { useChat } from '@ai-sdk/svelte';
	import { reviewCache } from '$lib/stores/reviewStore';
	import { onMount } from 'svelte';
	/** @type {{
    movieDetails: {
      title: string;
      release_date: string;
      overview: string;
      runtime: number;
      poster: string | null;
    };
    genres: Array<{ name: string }>;
    cast: Array<{
      id: number;
      name: string;
      character: string;
      picture: string | null;
      roles: number;
    }>;
  }} */
	export let data;
	/**
	 * Navigates to the movie page for the given movie ID.
	 * @param {number} id - The ID of the movie to navigate to.
	 */
	function navigateToActor(id) {
		goto(`/actor/${id}`);
	}

	let review = '';
	let showReviewButton = true;
	let isReviewLoading = false;

	const { input, handleSubmit, messages, isLoading } = useChat();

	onMount(() => {
		const cachedReview = $reviewCache[data.movieDetails.title];
		if (cachedReview) {
			review = cachedReview;
			showReviewButton = false;
		}
	});

	async function getReview() {
		showReviewButton = false;
		isReviewLoading = true;
		input.set(`Write a short review of the movie "${data.movieDetails.title}"`);
		await handleSubmit();

		while ($isLoading) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		review = $messages[$messages.length - 1].content;
		reviewCache.update((cache) => ({ ...cache, [data.movieDetails.title]: review }));
		isReviewLoading = false;
	}
</script>

<h1>{data.movieDetails.title}</h1>
<img
	src="data:image/jpeg;base64,{data.movieDetails.poster}"
	alt={data.movieDetails.title}
	style="height: 25%; width: 25%;"
/>
<p>Released: {data.movieDetails.release_date.split(' ')[0]}</p>
<p>Runtime: {data.movieDetails.runtime} minutes</p>
<p>Overview: {data.movieDetails.overview}</p>

{#if showReviewButton}
	<Button color="primary" on:click={getReview}>Get Review</Button>
{/if}

{#if isReviewLoading}
    <p>
        Loading review... <Spinner type="border" color="primary" size="sm" />
    </p>
{:else if review}
    <p>Review: {review}</p>
{/if}

<h2>Genres</h2>
<ul>
	{#each data.genres as genre}
		<li>{genre.name}</li>
	{/each}
</ul>

<h2>Cast</h2>
<div class="cast-list">
	{#each data.cast as actor}
		<a
			href="/actor/{actor.id}"
			class="actor-card"
			on:click|preventDefault={() => navigateToActor(actor.id)}
		>
			<div class="actor-info">
				<h3>{actor.name}</h3>
				<p>as {actor.character}</p>
				<p>Total roles: {actor.roles}</p>
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

<style>
	/* ... existing styles ... */
</style>
