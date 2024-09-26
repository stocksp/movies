<script>
	/** @type {{
    actorDetails: {
        name: string;
        birthday: Date;
        deathday: Date;
        birthplace: string;
        biography: string;
        picture: string | null;
    };
    roles: Array<{
        character: string;
		movieId: number;
        title: string;
        release_date: Date;
    }>;
    tv_roles: Array<{
        character: string;
		seriesid: number;
        name: string;
		first_air_date: Date;
    }>;
  }} */
	export let data;

	/** @type {number | null} */
	let ageInYears = null;

	/**
	 * @param {Date} birthday
	 * @param {Date | null} [endDate=null]
	 * @returns {number}
	 */
	function calculateAge(birthday, endDate = null) {
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
</script>

<h1>{data.actorDetails.name}</h1>
{#if data.actorDetails.picture}
	<img
		src="data:image/jpeg;base64,{data.actorDetails.picture}"
		alt={data.actorDetails.name}
		style="height: 20%; width: 20%;"
	/>
{:else}
	<div class="placeholder-image"></div>
{/if}
{#if data.actorDetails.birthday && data.actorDetails.deathday}
	<h6>
		Born {data.actorDetails.birthday.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
	</h6>
{:else if data.actorDetails.birthday && ageInYears !== null}
	<h6>
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
	<h2>Movie Roles</h2>
	<ul>
		{#each data.roles as role}
			<li>
				As {role.character} in <a href="/movie/{role.movieId}">{role.title}</a> released on {role.release_date.toLocaleDateString(
					'en-US',
					{ year: 'numeric', month: 'long', day: 'numeric' }
				)}
			</li>
		{/each}
	</ul>
{/if}
{#if data.tv_roles.length > 0}
	<h2>TV Roles</h2>
	<ul>
		{#each data.tv_roles as role}
			<li>
				As {role.character} in <a href="/tv_series/{role.seriesid}">{role.name}</a> released on {role.first_air_date.toLocaleDateString(
					'en-US',
					{ year: 'numeric', month: 'long', day: 'numeric' }
				)}
			</li>
		{/each}
	</ul>
{/if}
