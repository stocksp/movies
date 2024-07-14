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
