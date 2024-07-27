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
		input.set(`Write a short review of the movie "${data.movieDetails.title}" released "${data.movieDetails.release_date}"`);
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
