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
		<Card style="height: 100px; padding: 5px;">
			<Row class="h-100">
				<Col md="9" class="d-flex flex-column">
					<CardTitle class="mb-1 text-truncate">{record.title}</CardTitle>
					<CardText class="small mb-0" style="font-size: 0.8rem; line-height: 1.2;">
						<b>{new Date(record.release_date).getFullYear()}</b>
						({record.runtime} min)
						{record.overview}
					</CardText>
				</Col>
				<Col md="3" class="d-flex justify-content-end align-items-center p-0">
					<img
						src="data:image/jpeg;base64,{record.poster}"
						alt={record.title}
						style="height: 90px; width: auto; object-fit: contain;"
					/>
				</Col>
			</Row>
		</Card>
		{/each}
	{/if}
</Container>
  