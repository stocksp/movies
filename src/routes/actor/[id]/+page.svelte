<script>
	/** @type {{
    actorDetails: {
        name: string;
        birthday: string;
        deathday: string;
        birthplace: string;
        biography: string;
        picture: string | null;
    };
    roles: Array<{
        character: string;
		movieId: number;
        title: string;
        releasedate: string;
    }>;
    tv_roles: Array<{
        character: string;
		seriesid: number;
        name: string;
    }>;
  }} */
	export let data;

	/** @type {number | null} */
	let ageInYears = null;

	/**
	 * @param {string} birthday
	 * @param {string | null} [endDate=null]
	 * @returns {number}
	 */
	function calculateAge(birthday, endDate = null) {
		const dateBirth = new Date(birthday);
		const dateEnd = endDate ? new Date(endDate) : new Date();
		dateEnd.setHours(0, 0, 0, 0);
		const span = dateEnd.getTime() - dateBirth.getTime();
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
	<h6>Born {data.actorDetails.birthday}</h6>
{:else if data.actorDetails.birthday && ageInYears !== null}
	<h6>Born {data.actorDetails.birthday} Age {ageInYears}</h6>
{/if}
<h6>in {data.actorDetails.birthplace}</h6>
{#if data.actorDetails.birthday && data.actorDetails.deathday && ageInYears !== null}
	<h6>Died {data.actorDetails.deathday} Age {ageInYears}</h6>
{/if}
<h6>{data.actorDetails.biography}</h6>
<h2>Roles</h2>
<ul>
	{#each data.roles as role}
		<li>
			As {role.character} in <a href="/movie/{role.movieId}">{role.title}</a> released on {role.releasedate}
		</li>
	{/each}
</ul>
<h2>TV Roles</h2>
<ul>
	{#each data.tv_roles as role}
		<li>
			As {role.character} in <a href="/tv_series/{role.seriesid}">{role.name}</a>
		</li>
	{/each}
</ul>

