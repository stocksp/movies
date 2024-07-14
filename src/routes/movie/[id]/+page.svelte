<script>
	import { goto } from '$app/navigation';
  import {
        Container,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        Row,
        Col,
        CardTitle,
        Pagination,
        PaginationItem,
        PaginationLink
    } from '@sveltestrap/sveltestrap';

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
</script>

<h1>{data.movieDetails.title}</h1>
<p>Released: {data.movieDetails.release_date}</p>
<p>Runtime: {data.movieDetails.runtime} minutes</p>
<p>Overview: {data.movieDetails.overview}</p>

<h2>Genres</h2>
<ul>
	{#each data.genres as genre}
		<li>{genre.name}</li>
	{/each}
</ul>

<h2>Cast</h2>
<div class="cast-grid">
	{#each data.cast as actor}
		<Card
			class="actor-card"
      on:click={() => navigateToActor(actor.id)}
		>
			<div class="actor-image">
				{#if actor.picture}
					<img src="data:image/jpeg;base64,{actor.picture}" alt={actor.name} />
				{:else}
					<div class="placeholder-image"></div>
				{/if}
			</div>
			<div class="actor-info">
				<h3>{actor.name}</h3>
				<p>as {actor.character}</p>
				<p>Total roles: {actor.roles}</p>
			</div>
		</Card>
	{/each}
</div>

<style>
	.cast-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.actor-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		transition: box-shadow 0.3s ease;
	}

	.actor-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.actor-image {
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f0f0f0;
	}

	.actor-image img,
	.placeholder-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-image {
		background-color: #ddd;
	}

	.actor-info {
		padding: 1rem;
	}

	.actor-info h3 {
		margin: 0 0 0.5rem 0;
	}

	.actor-info p {
		margin: 0;
		font-size: 0.9rem;
	}
</style>
