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

<Container fluid>
	{#if data.movieData.length === 0}
		<p>Waiting on data...</p>
	{:else}
		<h3>{data.movieData[0].title}</h3>
		{#each data.movieData as record}
			<Card>
				<Row>
					<Col md="4">
						<img
							src="data:image/jpeg;base64,{record.picture}"
							alt={record.name}
							class="img-fluid rounded-start"
						/>
					</Col>
					<Col md="8">
						<CardTitle>{record.name}</CardTitle>
						<CardText>{record.character}</CardText>
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
