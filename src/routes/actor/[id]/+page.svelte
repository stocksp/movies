<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	interface ActorDetails {
		name: string;
		birthday: Date;
		deathday: Date;
		birthplace: string;
		biography: string;
		picture: string | null;
	}

	interface Role {
		character: string;
		movieId: number;
		title: string;
		releasedate: Date;
	}

	interface TvRole {
		character: string;
		seriesid: number;
		name: string;
		first_air_date: string;
	}

	interface ActorData {
		actorDetails: ActorDetails;
		roles: Role[];
		tv_roles: TvRole[];
	}

	let { data }: { data: PageData } = $props();
	let ageInYears: number | null = $state(null);

	function calculateAge(birthday: Date, endDate: Date | null = null): number {
		const dateEnd = endDate ? new Date(endDate) : new Date();
		dateEnd.setHours(0, 0, 0, 0);
		const span = dateEnd.getTime() - birthday.getTime();
		return Math.floor(span / (1000 * 60 * 60 * 24 * 365.25));
	}

	if (data.actorDetails.birthday) {
		if (data.actorDetails.deathday) {
			ageInYears = calculateAge(data.actorDetails.birthday, data.actorDetails.deathday);
		} else {
			ageInYears = calculateAge(data.actorDetails.birthday);
		}
	}

	let imageOpacity = $state(0);

	onMount(() => {
		setTimeout(() => {
			imageOpacity = 1;
		}, 50);
	});
</script>

<h1 class="text-2xl font-bold">{data.actorDetails.name}</h1>
{#if data.actorDetails.picture}
	<img
		src="data:image/jpeg;base64,{data.actorDetails.picture}"
		alt={data.actorDetails.name}
		style="height: 20%; width: 20%; opacity: {imageOpacity}; transition: opacity 5s ease; box-shadow: 8px 8px 15px 5px rgba(174, 97, 79, 0.6);"
	/>
{:else}
	<div class="placeholder-image"></div>
{/if}
{#if data.actorDetails.birthday && data.actorDetails.deathday}
	<h6 class="pt-3">
		Born {data.actorDetails.birthday.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
	</h6>
{:else if data.actorDetails.birthday && ageInYears !== null}
	<h6 class="pt-2">
		Born {data.actorDetails.birthday.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})} Age {ageInYears}
	</h6>
{/if}
{#if data.actorDetails.birthplace}
	<h6>in {data.actorDetails.birthplace}</h6>
{/if}
{#if data.actorDetails.birthday && data.actorDetails.deathday && ageInYears !== null}
	<h6>
		Died {data.actorDetails.deathday.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})} Age {ageInYears}
	</h6>
{/if}
<h6>{data.actorDetails.biography}</h6>
{#if data.roles.length > 0}
	<h2 class="text-lg font-bold">Movie Roles</h2>
	<ul>
		{#each data.roles as role}
			<li>
				As {role.character} in
				<a href="/movie/{role.movieId}" class="text-blue-600 hover:underline">{role.title}</a>
				released on {role.release_date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</li>
		{/each}
	</ul>
{/if}
{#if data.tv_roles.length > 0}
	<h2 class="text-lg font-bold">TV Roles</h2>
	<ul>
		{#each data.tv_roles as role}
			<li>
				As {role.character} in
				<a href="/tv_series/{role.seriesid}" class="text-blue-600 hover:underline">{role.name}</a>
				released on {role.first_air_date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</li>
		{/each}
	</ul>
{/if}
