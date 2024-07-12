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
		CardTitle,
		Pagination,
		PaginationItem,
		PaginationLink
	} from '@sveltestrap/sveltestrap';
    /** @type {{name: string, genres: string[]}} */
    /** @type {{
	  movieData: Array<{
		title: string;
		release_date: string;
		runtime: string;
        overview: string;
		poster: string | null;
	  }>;
	  
	}} */
    export let data;
  </script>
  
  <h1>Search Results</h1>
   
  <!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
  <Container fluid>
	{#if data.movieData.length === 0}
		<p>Waiting on data...</p>
	{:else}
		
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
							alt={record.poster}
							class="img-fluid rounded-start"
						/>
					</Col>
				</Row>
			</Card>
		{/each}
	{/if}
</Container>
  