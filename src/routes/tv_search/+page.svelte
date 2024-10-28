<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	interface TvSeries {
		title: string;
		overview: string;
		backdrop: string | null;
		seasons: number;
		id: number;
		first_air_date: Date;
	}

	interface Genre {
		id: number;
		name: string;
	}

	interface PageProps {
		movieData: TvSeries[];
		pagination: {
			currentPage: number;
			totalPages: number;
			pageSize: number;
			totalCount: number;
		};
		genreNames: Genre[];
	}

	let { data }: { data: PageData } = $props();

	function navigateToMovie(id: number) {
		goto(`/tv_series/${id}`);
	}

	function changePage(page: number, event: Event) {
		event.preventDefault();
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('page', page.toString());
		goto(currentUrl.toString());
	}

	const searchParams = new URLSearchParams($page.url.searchParams);
	const currentName = searchParams.get('name') || '';
	const currentGenreIds = searchParams.getAll('genres');
	const currentGenres = data.genreNames
		.filter((genre) => currentGenreIds.includes(genre.id.toString()))
		.map((genre) => genre.name);
	const totalResults = data.pagination?.totalCount ?? 0;
</script>

<h1 class="text-2xl font-bold mb-4">Search Results</h1>
<p class="mb-2">Showing results for: {currentName}</p>
{#if currentGenres.length > 0}
	<p class="mb-2">Genres: {currentGenres.join(', ')}</p>
{/if}
<p class="mb-4">Total results: {totalResults}</p>

<div class="container mx-auto">
	{#if data.movieData?.length === 0}
		<p>Waiting on data...</p>
	{:else}
		{#if (data.pagination?.totalPages ?? 0) > 1}
			<nav class="mb-4">
				<ul class="flex justify-center">
					<li class="mr-2">
						<button
							class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={data.pagination?.currentPage === 1}
							onclick={(e) => {
								if (data.pagination) {
									changePage(data.pagination.currentPage - 1, e);
								}
							}}
						>
							Previous
						</button>
					</li>
					{#each Array(data.pagination?.totalPages ?? 0) as _, i}
						<li class="mr-2">
							<button
								class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded {i +
									1 ===
								(data.pagination?.currentPage ?? 0) /* Fix 4 */
									? 'bg-blue-500 text-white'
									: ''}"
								onclick={(e) => changePage(i + 1, e)}
							>
								{i + 1}
							</button>
						</li>
					{/each}
					<li>
						<button
							class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={data.pagination?.currentPage === data.pagination?.totalPages}
							onclick={(e) => {
								if (data.pagination) {
									changePage(data.pagination.currentPage + 1, e);
								}
							}}
						>
							Next
						</button>
					</li>
				</ul>
			</nav>
		{/if}

		{#if data.movieData}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.movieData as record}
					<Card class="w-full">
						<CardHeader>
							<CardTitle class="truncate pb-1">{record.title}</CardTitle>
							<CardDescription class="truncate">
								{record.seasons} Season{record.seasons > 1 ? 's' : ''} - First aired: {record.first_air_date.toLocaleDateString(
									'en-US',
									{ year: 'numeric', month: 'short', day: 'numeric' }
								)}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="flex items-start space-x-4">
								<img
									src="data:image/jpeg;base64,{record.backdrop}"
									alt={record.title}
									class="h-20 w-auto object-contain"
								/>
								<p class="text-sm overflow-auto h-20">{record.overview}</p>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								class="w-full bg-emerald-300"
								on:click={() => navigateToMovie(record.id)}
							>
								View Details
							</Button>
						</CardFooter>
					</Card>
				{/each}
			</div>
		{/if}
	{/if}
</div>
