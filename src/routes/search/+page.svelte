<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function navigateToMovie(id: number) {
		console.log('navigation to:', id)
		goto(`/movie/${id}`);
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
	{#if data.movieData.length === 0}
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
									// Check if data.pagination is defined
									changePage(data.pagination.currentPage - 1, e);
								}
							}}
						>
							Previous
						</button>
					</li>
					{#each Array(data.pagination?.totalPages) as _, i}
						<li class="mr-2">
							<button
								class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded {i +
									1 ===
								data.pagination?.currentPage
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
									// Check if data.pagination is defined
									changePage(data.pagination.currentPage 
									= 1, e);
								}
							}}
						>
							Next
						</button>
					</li>
				</ul>
			</nav>
		{/if}

		{#each data.movieData as record}
			<button
				class="flex h-24 bg-gradient-to-b from-teal-100  to-teal-700 via-transparent shadow-lg shadow-blue-700 rounded-lg overflow-hidden mb-4 cursor-pointer"
				onclick={() => navigateToMovie(record.id)}
			>
			<div class="flex-grow p-2">
				<h2 class="text-left text-2xl font-bold p-0  mb-1 truncate">{record.title}</h2>
				<p class="line-clamp-2 text-left text-sm  font-semibold text-black">
					<b>{record.release_date.getFullYear()}</b>
					({record.runtime} min)
					{record.overview}
				</p>
			</div>
			<div class="flex-shrink-0 p-2">
				<img
					src="data:image/jpeg;base64,{record.poster}"
					alt={record.title}
					style="height: 80px; object-fit: contain;"
				/>
			</div>
			</button>
		{/each}
	{/if}
</div>
