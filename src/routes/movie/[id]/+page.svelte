<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { useChat } from '@ai-sdk/svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	interface Genre {
		name: string;
	}

	let { data }: { data: PageData } = $props();

	let reviewText = $state(data.movieDetails?.review);
	let isLoading = $state(false);

	let updateForm: HTMLFormElement | null = $state(null);

	let addForm: HTMLFormElement | null = $state(null);

	//const { input, handleSubmit, messages, isLoading: chatIsLoading } = useChat();

	function navigateToActor(id: number) {
		goto(`/actor/${id}`);
	}

	/* async function getReview() {
		isLoading = true;
		input.set(
			`Write a short review of the movie "${data.movieDetails?.title}" released "${data.movieDetails?.release_date}"`
		);
		await handleSubmit();

		while ($chatIsLoading) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		reviewText = $messages[$messages.length - 1].content;
		isLoading = false;
	} 

	async function handleAddReview() {
		if (!reviewText) {
			await getReview();
		}
		if (addForm) {
			addForm.submit();
		}
	}

	async function handleUpdateReview() {
		await getReview();
		if (updateForm) {
			updateForm.submit();
		}
	}*/
</script>

<p class="text-3xl font-bold">{data.movieDetails?.title}</p>
<img
	src="data:image/jpeg;base64,{data.movieDetails?.poster}"
	alt={data.movieDetails?.title}
	style="height: 25%; width: 25%;"
/>
<p><b>Released:</b> {data.movieDetails?.release_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p><b>Runtime:</b> {data.movieDetails?.runtime} minutes</p>
<p><b>Overview:</b> {data.movieDetails?.overview}</p>

{#if data.movieDetails?.review}
	<p>Review: {data.movieDetails?.review}</p>
{/if}

<!-- <div class="button-container">
	{#if data.movieDetails?.review}
		<form
			method="POST"
			action="?/updateReview"
			use:enhance
			bind:this={updateForm}
			class="button-form"
		>
			<input type="hidden" name="review" bind:value={reviewText} />

			<button
				type="button"
				onclick={handleUpdateReview}
				disabled={isLoading}
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
				>Update Review</button
			>
		</form>
		<form method="POST" action="?/removeReview" use:enhance class="button-form">
			<button
				type="submit"
				disabled={isLoading}
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
				>Remove Review</button
			>
		</form>
	{:else}
		<form method="POST" action="?/addReview" use:enhance bind:this={addForm} class="button-form">
			<input type="hidden" name="review" bind:value={reviewText} />
			<button
				type="button"
				onclick={handleAddReview}
				disabled={isLoading}
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Add Review
			</button>
		</form>
	{/if}
</div> -->

{#if isLoading}
	<div class="spinner-container flex items-center justify-center">
		<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
	</div>
{/if}

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

<p class="font-bold pt-1 pb-1">Cast</p>
<div class="cast-list">
	{#if data.cast}
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
	{:else}
		<p>No cast information available.</p>
	{/if}
</div>

<style>
	.button-container {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.button-form {
		flex: 1;
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
