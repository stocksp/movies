<script>
	/** @type {{
	  movieData: Array<{
		title: string;
		release_date: string;
		name: string;
		character: string;
		birthday: string;
		birthplace: string;
		picture: string | null;
	  }>;
	}} */
	export let data;
  </script>
  

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap' movies" />
</svelte:head>

{#if data.movieData.length === 0}
	<p>Waiting on data...</p>
{:else}
	{#each data.movieData as record}
		<p>
			Title: {record.title}<br />
			Release Date: {new Date(record.release_date).toLocaleDateString()}<br />
			Actor: {record.name}<br />
			Character: {record.character}<br />
			Birthday: {new Date(record.birthday).toLocaleDateString()}<br />
			Birthplace: {record.birthplace}<br />
			{#if record.picture}
				<img src="data:image/jpeg;base64,{record.picture}" alt={record.name} />
			{/if}
		</p>
	{/each}
{/if}
