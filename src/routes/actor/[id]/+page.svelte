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

	console.log(JSON.stringify(data, null, 2));
</script>

<h1>{data.actorDetails.name}</h1>
{#if data.actorDetails.picture}
<img src="data:image/jpeg;base64,{data.actorDetails.picture}" alt={data.actorDetails.name} style="height: 20%; width: 20%;" />
{:else}
<div class="placeholder-image"></div>
{/if}
<h6>Born {data.actorDetails.birthday}</h6>
<h6>in {data.actorDetails.birthplace}</h6>
{#if data.actorDetails.deathday}
 <h6>Died {data.actorDetails.deathday}</h6>
{/if}
<h6>{data.actorDetails.biography}</h6>
<h2>Roles</h2>
<ul>
	{#each data.roles as role}
		<li>As {role.character} in {role.title} released on {role.releasedate}</li>
	{/each}
</ul>
