<script>
  /** @type {{
    movieDetails: {
      title: string;
      release_date: string;
      overview: string;
      runtime: number;
      poster: string | null;
    };
    genres: Array<{ name: string }>;
    cast: Array<{
      name: string;
      character: string;
      picture: string | null;
      roles: number;
    }>;
  }} */
  export let data;

  //console.log(JSON.stringify(data, null, 2));
</script>

<h1>{data.movieDetails.title}</h1>
<p>Released: {data.movieDetails.release_date}</p>
<p>Runtime: {data.movieDetails.runtime} minutes</p>
<p>Overview: {data.movieDetails.overview}</p>

<h2>Genres</h2>
<ul>
  {#each data.genres as genre}
    <li>{genre.name}</li>
  {/each}
</ul>

<h2>Cast</h2>
<ul>
  {#each data.cast as actor}
  <li style="height: 60px; display: flex; align-items: center;">
    {#if actor.picture}
      <img 
        src="data:image/jpeg;base64,{actor.picture}" 
        alt={actor.name} 
        style="height: 50px; width: 50px; object-fit: contain; margin-right: 10px;" 
      />
    {:else}
      <div style="width: 50px; height: 50px; margin-right: 10px;"></div>
    {/if}
    <span>{actor.name} as {actor.character} (Total roles: {actor.roles})</span>
  </li>
  {/each}
</ul>