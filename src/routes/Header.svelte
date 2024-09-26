<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	//import { Icon, Tooltip } from '@sveltestrap/sveltestrap';
	
	/** @type {{ branchName: string; commitHash: string; buildDate: string }} */
	//const buildInfo = import.meta.env.VITE_BUILD_INFO;

	// Format commit hash to show only first 8 characters
	//const shortCommitHash = buildInfo.commitHash.slice(0, 8);

	/**
	 * Formats a date string into a more readable format
	 * @param {string} dateString - The ISO date string to format
	 * @returns {string} The formatted date string
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		/** @type {Intl.DateTimeFormatOptions} */
		const options = { 
			month: 'short', 
			day: 'numeric', 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true
		};
		return date.toLocaleString('en-US', options);
	};

	//const formattedBuildDate = formatDate(buildInfo.buildDate);
</script>
<header>
	<div class="corner">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/actors' ? 'page' : undefined}>
				<a href="/actors">Actors</a>
			</li>
			<li aria-current={$page.url.pathname === '/tv' ? 'page' : undefined}>
				<a href="/tv">TV</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner relative w-12 h-12"> 
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button 
			id="info" 
			class="text-gray-500 hover:text-gray-700"
			aria-describedby="info-tooltip" 
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</button>
	
		<div 
			id="info-tooltip"
			role="tooltip"
			class="absolute z-10 invisible bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 shadow-lg opacity-0 transition-opacity duration-300 -left-16 top-2 peer-hover:visible peer-hover:opacity-100"
		>
			<p>Branch: Todo branch</p>
			<p>Commit: todo hash</p>
			<p>Build Date: todo date</p>
			<div class="tooltip-arrow absolute -left-2 top-2 w-2 h-2 transform rotate-45 bg-gray-100 border-t border-gray-200 border-l border-gray-200"></div>
		</div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
