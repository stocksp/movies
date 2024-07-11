<script>
	import { Container, Form, FormGroup, Input, Button } from '@sveltestrap/sveltestrap';

/** @type {string} */
let name = '';

/** @type {string[]} */
let selectedGenres = [];

/** @type {string[]} */
const genres = ['Adventure', 'Fantasy', 'Animation', 'Drama', 'Horror', 'Action', 'Comedy', 'History', 'Western', 'Thriller', 'Crime', 'Documentary', 'Science Fiction', 'Mystery', 'Music', 'Romance', 'Family', 'War', 'TV Movie'];

/**
 * Handles the button click event
 */
function handleClick() {
    console.log('Name:', name);
    console.log('Selected Genres:', selectedGenres);
}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap's movies" />
</svelte:head>

<Container fluid>
	<Form>
		<FormGroup row>
			<Input name='name' placeholder="Enter a movie name" bind:value={name} />
		</FormGroup>
		<FormGroup row>
			<label for="genra">Choose a Genra:</label>

			<select name="genra" id="genra" multiple bind:value={selectedGenres}>
				<option value="" disabled>--Choose a Genra--</option>
				{#each genres as genre}
					<option value={genre}>{genre}</option>
				{/each}
			</select>
		</FormGroup>
		<Button size="md" on:click={handleClick} disabled={!name}>Go get em!</Button>
	</Form>
</Container>