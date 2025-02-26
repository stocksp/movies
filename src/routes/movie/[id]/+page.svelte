<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	interface Genre {
		name: string;
	}

	export let data: PageData;

	let reviewText: string | null = null;
	let isLoading: boolean = false;
	let messageText: string = ''; // Input field value
	let messages: { role: string; content: string }[] = []; // Local messages array
	let addForm: HTMLFormElement | null = null;
	let updateForm: HTMLFormElement | null = null;

	async function getReview() {
		isLoading = true;
		const prompt = `Write a short review of the movie "${data.movieDetails?.title}" released "${data.movieDetails?.release_date}"`;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let accumulatedResponse = ''; // Accumulate the streaming response

			if (reader) {
				// Check if response.body is not null
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}
					accumulatedResponse += decoder.decode(value);
					messages = [...messages, { role: 'assistant', content: accumulatedResponse }]; // Update the local messages array
				}
			}

			reviewText = accumulatedResponse; // Set reviewText to the full response
			console.log('Full review text:', reviewText);
		} catch (error) {
			console.error('Error fetching review:', error);
			reviewText = 'Error fetching review.';
		} finally {
			isLoading = false;
		}
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
	}

	function navigateToActor(id: number) {
		goto(`/actor/${id}`);
	}
</script>

<p class="text-3xl font-bold text-center pb-2">{data.movieDetails?.title}</p>
<div style="display: flex; align-items: center;">
	<div style="flex: 1;">
		<img
			src="data:image/jpeg;base64,{data.movieDetails?.poster}"
			alt={data.movieDetails?.title}
			style="height: 100%; width: 100%; object-fit: contain; box-shadow: 8px 8px 15px 5px rgba(174, 97, 79, 0.6);"
		/>
	</div>
	<div style="flex: 3; padding-left: 20px;">
		<p>
			<b>Released:</b>
			{data.movieDetails?.release_date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			})}
		</p>
		<p><b>Runtime:</b> {data.movieDetails?.runtime} minutes</p>
		<p><b>Overview:</b> {data.movieDetails?.overview}</p>
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
	</div>
</div>

{#if data.movieDetails?.review}
	<p class="pt-3 pb-1">
		<span class="font-bold">Review:&nbsp&nbsp</span><span>{data.movieDetails?.review}</span>
	</p>
{/if}

<div class="button-container">
	{#if data.movieDetails?.review}
		<div class="flex flex-col md:flex-row md:space-x-2">
			<form
				method="POST"
				action="?/updateReview"
				use:enhance
				bind:this={updateForm}
				class="button-form mt-2"
			>
				<input type="hidden" name="review" bind:value={reviewText} />

				<button
					type="button"
					onclick={handleUpdateReview}
					disabled={isLoading}
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
					>Update Review</button
				>
			</form>
			<form method="POST" action="?/removeReview" use:enhance class="button-form mt-2">
				<button
					type="submit"
					disabled={isLoading}
					class= "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
					>Remove Review</button
				>
			</form>
		</div>
	{:else}
		<form
			method="POST"
			action="?/addReview"
			use:enhance
			bind:this={addForm}
			class="button-form mt-4"
		>
			<input type="hidden" name="review" bind:value={reviewText} />
			<button
				type="button"
				onclick={handleAddReview}
				disabled={isLoading}
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Add Review
			</button>
		</form>
	{/if}
</div>

{#if isLoading}
	<div class="spinner-container flex items-center justify-center">
		<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
	</div>
{/if}

<p class="font-bold pt-3 pb-1">Cast</p>
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
