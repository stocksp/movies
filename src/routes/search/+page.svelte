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
		<Card style="height: 100px; padding: 5px; margin-bottom: 10px;">
			<Row class="h-100">
				<Col xs="10" class="d-flex flex-column pr-0">
					<CardTitle class="large mb-0 text-truncate card-title">{record.title}</CardTitle>
					<CardText class="small mb-0 card-text">
						<b>{new Date(record.release_date).getFullYear()}</b>
						({record.runtime} min)
						{record.overview.substring(0, 80)}...
					</CardText>
				</Col>
				<Col xs="2" class="d-flex justify-content-end align-items-center pl-0">
					<img
						src="data:image/jpeg;base64,{record.poster}"
						alt={record.title}
						class="movie-poster"
						style="height: 90px; object-fit: contain;"
					/>
				</Col>
			</Row>
		</Card>
		{/each}
	{/if}
</Container>
  