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
	import { goto } from '$app/navigation';

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
	  pagination: {
		currentPage: number;
		totalPages: number;
		pageSize: number;
		totalCount: number;
	  };
	}} */
	export let data;

	function changePage(page) {
		goto(`?page=${page}`);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Cap's movies" />
</svelte:head>

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
							alt={record.name}
							class="img-fluid rounded-start"
						/>
					</Col>
				</Row>
			</Card>
		{/each}

		<Pagination aria-label="Page navigation">
			<PaginationItem disabled={data.pagination.currentPage === 1}>
				<PaginationLink previous href="?page={data.pagination.currentPage - 1}">
					<a href="?page={data.pagination.currentPage - 1}" on:click|preventDefault={() => changePage(data.pagination.currentPage - 1)}>Previous</a>
				</PaginationLink>
			</PaginationItem>
			{#each Array(data.pagination.totalPages) as _, i}
				<PaginationItem active={i + 1 === data.pagination.currentPage}>
					<PaginationLink href="?page={i + 1}">
						<a href="?page={i + 1}" on:click|preventDefault={() => changePage(i + 1)}>{i + 1}</a>
					</PaginationLink>
				</PaginationItem>
			{/each}
			<PaginationItem disabled={data.pagination.currentPage === data.pagination.totalPages}>
				<PaginationLink next href="?page={data.pagination.currentPage + 1}">
					<a href="?page={data.pagination.currentPage + 1}" on:click|preventDefault={() => changePage(data.pagination.currentPage + 1)}>Next</a>
				</PaginationLink>
			</PaginationItem>
		</Pagination>
	{/if}
</Container>
