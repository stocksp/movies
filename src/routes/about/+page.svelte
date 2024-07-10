<script>
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
		CardTitle
	} from '@sveltestrap/sveltestrap';
	/** @type {{
	  movieData: Array<{
		title: string;
		release_date: string;
		overview: string;
		runtime: string;
		poster: string | null;
	  }>;
	}} */
	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap's movies" />
</svelte:head>

<Container fluid>
	{#if data.movieData.length === 0}
		<p>Waiting on data...</p>
	{:else}
		<!-- <h3>{data.movieData[0].title}</h3> -->
		{#each data.movieData as record}
			<Card>
				<Row>
					<Col md="8">
						<CardTitle>{record.title}</CardTitle>
						<CardText
							><b>{new Date(record.release_date).getFullYear()}</b>
							({record.runtime} min)
							{record.overview.substring(0, 150)}</CardText
						>
					</Col>
					<Col md="1">
						<img
							src="data:image/jpeg;base64,{record.poster}"
							alt={record.title}
							class="img-fluid rounded-start"
						/>
					</Col>
				</Row>
			</Card>
			<!-- <p>
				Release Date: {new Date(record.release_date).toLocaleDateString()}<br />
				Actor: {record.name}<br />
				Character: {record.character}<br />
				Birthday: {new Date(record.birthday).toLocaleDateString()}<br />
				Birthplace: {record.birthplace}<br />
				{#if record.picture}
					<img src="data:image/jpeg;base64,{record.picture}" alt={record.name} />
				{/if}
			</p> -->
		{/each}
	{/if}
</Container>
