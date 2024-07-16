<script>
	/** @type {{
    actorDetails: {
        name: string;
        birthday: string;
        deathday: string
        birthplace: string;
        biography: string;
        picture: string | null;
    };
    roles: Array<{
        character: string;
        title: string;
        releasedate: string;
    }>;
  }} */
	export let data;
	//console.log(JSON.stringify(data, null, 2));

	// deal with age and death
	let dateBirth, dateDeath, dateToday, ageInYears, span;
	if (data.actorDetails.birthday != '' && data.actorDetails.deathday != '') {
		dateBirth = new Date(data.actorDetails.birthday);
		dateDeath = new Date(data.actorDetails.deathday);
		span = dateDeath - dateBirth;
		ageInYears = Math.floor(span / (1000 * 60 * 60 * 24 * 365.25)); // More accurate for leap years
	} else if (data.actorDetails.birthday != '' && data.actorDetails.deathday == '') {
		dateToday = new Date();
		dateToday.setHours(0, 0, 0, 0);
		dateBirth = new Date(data.actorDetails.birthday);
		span = dateToday - dateBirth;
		ageInYears = Math.floor(span / (1000 * 60 * 60 * 24 * 365.25)); // More accurate for leap years
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
{:else}
	<h6>Born {data.actorDetails.birthday} Age {ageInYears}</h6>
{/if}
<h6>in {data.actorDetails.birthplace}</h6>
{#if data.actorDetails.birthday && data.actorDetails.deathday}
	<h6>Died {data.actorDetails.deathday} Age {ageInYears}</h6>
{/if}
<h6>{data.actorDetails.biography}</h6>
<h2>Roles</h2>
<ul>
	{#each data.roles as role}
		<li>As {role.character} in {role.title} released on {role.releasedate}</li>
	{/each}
</ul>
