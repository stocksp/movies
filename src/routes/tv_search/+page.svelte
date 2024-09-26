<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

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
			{#each data.movieData as record}
				<button
					class="bg-white shadow-md rounded-lg overflow-hidden mb-4 cursor-pointer"
					onclick={() => navigateToMovie(record.id)}
				>
					<div class="flex h-24">
						<div class="flex-grow p-4">
							<h2 class="text-lg font-bold mb-1 truncate">{record.title}</h2>
							<p class="text-sm text-gray-600">
								{record.seasons} Seasons -- First aired: {record.first_air_date.toLocaleDateString(
									'en-US',
									{ year: 'numeric', month: 'long', day: 'numeric' }
								)}
							</p>
							<p class="text-sm text-gray-600">
								{record.overview.substring(0, 80)}...
							</p>
						</div>
						<div class="w-24 h-full flex items-center justify-center">
							<img
								src="data:image/jpeg;base64,{record.backdrop}"
								alt={record.title}
								class="h-20 object-contain"
							/>
						</div>
					</div>
				</button>
			{/each}
		{/if}
	{/if}
</div>
