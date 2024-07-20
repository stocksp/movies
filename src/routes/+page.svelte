<script>
	import { Container, Form, FormGroup, Input, Button } from '@sveltestrap/sveltestrap';
	import { goto } from '$app/navigation';

	/** @type {string} */
	let name = '';

	/** @type {string[]} */
	let selectedGenres = [];

	/** @type {string} */
	let genrecount = '';

	/** @type {string[]} */
	const genres = [
		'Adventure',
		'Fantasy',
		'Animation',
		'Drama',
		'Horror',
		'Action',
		'Comedy',
		'History',
		'Western',
		'Thriller',
		'Crime',
		'Documentary',
		'Science Fiction',
		'Mystery',
		'Music',
		'Romance',
		'Family',
		'War',
		'TV Movie'
	];

	/** @type {{
    genre: {
      id: number;
      title: string;
    };
  }} */

	/**
	 * Handles the form submission
	 * @param {Event} event
	 */
	function handleSubmit(event) {
		event.preventDefault();
		const params = new URLSearchParams();
		params.append('name', name);
		genrecount = selectedGenres.length.toString();
		params.append('genrecount', genrecount.toString());
		selectedGenres.forEach((genre) => params.append('genres', genre));
		goto(`/search?${params.toString()}`);
	}
	export let data;
	console.log('Genre', { data.genres[0].name });

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap's movies" />
</svelte:head>

<Container fluid>
	<Form on:submit={handleSubmit}>
		<FormGroup row>
			<Input name="name" placeholder="Enter a movie name" bind:value={name} />
		</FormGroup>
		<FormGroup row>
			<label for="genra">Choose a Genre:</label>

			<select name="genra" id="genra" multiple bind:value={selectedGenres}>
				<option value="" disabled>--Choose a Genre--</option>
				{#each genres as genre}
					<option value={genre}>{genre}</option>
				{/each}
			</select>
		</FormGroup>
		<Button type="submit" size="md">Retrieve Movies</Button>
	</Form>
</Container>
