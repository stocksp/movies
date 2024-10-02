<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { useChat } from '@ai-sdk/svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
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
<p>
	<b>Released:</b>
	{data.movieDetails?.release_date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})}
</p>
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
<div class="flex-container">
	{#if data.cast}
		{#each data.cast as actor}
			<div class="flex-item">
				<div class="grid-container">
					<div class="actor font-bold">{actor.name}</div>
					<div class="picture flex justify-center">
						{#if actor.picture}
							<img src="data:image/jpeg;base64,{actor.picture}" alt={actor.name}
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

<style>
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
		height: 24px ;
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
