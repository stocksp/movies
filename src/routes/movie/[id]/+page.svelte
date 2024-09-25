<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Spinner, Button } from '@sveltestrap/sveltestrap';
	import { useChat } from '@ai-sdk/svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let reviewText = data.movieDetails.review;
	let isLoading = false;
	/** @type {HTMLFormElement | null} */
	let updateForm = null;
	/** @type {HTMLFormElement | null} */
	let addForm = null;

	const { input, handleSubmit, messages, isLoading: chatIsLoading } = useChat();

	/**
	 * @param {number} id
	 */
	function navigateToActor(id) {
		goto(`/actor/${id}`);
	}

	async function getReview() {
		isLoading = true;
		input.set(
			`Write a short review of the movie "${data.movieDetails.title}" released "${data.movieDetails.release_date}"`
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
	}
</script>

<h1>{data.movieDetails.title}</h1>
<img
	src="data:image/jpeg;base64,{data.movieDetails.poster}"
	alt={data.movieDetails.title}
	style="height: 25%; width: 25%;"
/>
<p>Released: {data.movieDetails.release_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p>Runtime: {data.movieDetails.runtime} minutes</p>
<p>Overview: {data.movieDetails.overview}</p>

{#if data.movieDetails.review}
	<p>Review: {data.movieDetails.review}</p>
{/if}

<div class="button-container">
	{#if data.movieDetails.review}
		<form
			method="POST"
			action="?/updateReview"
			use:enhance
			bind:this={updateForm}
			class="button-form"
		>
			<input type="hidden" name="review" bind:value={reviewText} />

			<Button type="button" on:click={handleUpdateReview} disabled={isLoading} color="primary" block
				>Update Review</Button
			>
		</form>
		<form method="POST" action="?/removeReview" use:enhance class="button-form">
			<Button type="submit" disabled={isLoading} color="danger" block>Remove Review</Button>
		</form>
	{:else}
		<form method="POST" action="?/addReview" use:enhance bind:this={addForm} class="button-form">
			<input type="hidden" name="review" bind:value={reviewText} />
			<Button type="button" on:click={handleAddReview} disabled={isLoading} color="success" block
				>Add Review</Button
			>
		</form>
	{/if}
</div>

{#if isLoading}
	<div class="spinner-container">
		<Spinner color="primary" />
	</div>
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
