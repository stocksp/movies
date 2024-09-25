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
        movieData: Array<{
            title: string;
            overview: string;
            backdrop: string | null;
			seasons: number
            id: number;
			first_air_date: Date;
        }>;
        pagination: {
            currentPage: number;
            totalPages: number;
            pageSize: number;
            totalCount: number;
        };
        genreNames: Array<{
            id: number;
            name: string;
        }>;
    }} */
	export let data;

	function navigateToMovie(id) {
		goto(`/tv_series/${id}`);
	}

	function changePage(page, event) {
		event.preventDefault();
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('page', page.toString());
		goto(currentUrl.toString());
	}

	$: searchParams = new URLSearchParams(window.location.search);
	$: currentName = searchParams.get('name') || '';
	$: currentGenreIds = searchParams.getAll('genres');
	$: currentGenres = data.genreNames
		.filter((genre) => currentGenreIds.includes(genre.id.toString()))
		.map((genre) => genre.name);
	$: totalResults = data.pagination.totalCount;
</script>

<h1>Search Results</h1>
<p>Showing results for: {currentName}</p>
{#if currentGenres.length > 0}
	<p>Genres: {currentGenres.join(', ')}</p>
{/if}
<p>Total results: {totalResults}</p>

<Container fluid>
	{#if data.movieData.length === 0}
		<p>Waiting on data...</p>
	{:else}
		{#if data.pagination.totalPages > 1}
			<Pagination aria-label="Page navigation">
				<PaginationItem disabled={data.pagination.currentPage === 1}>
					<PaginationLink
						previous
						href="?page={data.pagination.currentPage - 1}"
						on:click={(e) => changePage(data.pagination.currentPage - 1, e)}
					>
						Previous
					</PaginationLink>
				</PaginationItem>
				{#each Array(data.pagination.totalPages) as _, i}
					<PaginationItem active={i + 1 === data.pagination.currentPage}>
						<PaginationLink href="?page={i + 1}" on:click={(e) => changePage(i + 1, e)}>
							{i + 1}
						</PaginationLink>
					</PaginationItem>
				{/each}
				<PaginationItem disabled={data.pagination.currentPage === data.pagination.totalPages}>
					<PaginationLink
						next
						href="?page={data.pagination.currentPage + 1}"
						on:click={(e) => changePage(data.pagination.currentPage + 1, e)}
					>
						Next
					</PaginationLink>
				</PaginationItem>
			</Pagination>
		{/if}

		{#each data.movieData as record}
			<Card
				style="height: 100px; padding: 5px; margin-bottom: 10px; cursor: pointer;"
				on:click={() => navigateToMovie(record.id)}
			>
				<Row class="h-100">
					<Col xs="10" class="d-flex flex-column pr-0">
						<CardTitle class="large mb-0 text-truncate card-title">{record.title}</CardTitle>
						<CardText class="small mb-0 card-text">
							{record.seasons} Seasons -- First aired: {record.first_air_date.toLocaleDateString(
								'en-US',
								{ year: 'numeric', month: 'long', day: 'numeric' }
							)}
						</CardText>
						<CardText class="small mb-0 card-text">
							{record.overview.substring(0, 80)}...
						</CardText>
					</Col>
					<Col xs="2" class="d-flex justify-content-end align-items-center pl-0">
						<img
							src="data:image/jpeg;base64,{record.backdrop}"
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
