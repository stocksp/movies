/** @type {{
    actorDetails: {
        name: string;
        title: string;
        birthday: string;
        deathday: string
        birthplace: string;
        biography: string;
      poster: string | null;
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
