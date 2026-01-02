<script>
	/** @type {{ learningMethods: Array<{_id:string,name:string,description?:string,defaultWorkMinutes?:number,defaultBreakMinutes?:number}> }} */
	export let data;

	import LearningMethodCard from '$lib/components/LearningMethodCard.svelte';
</script>

<div class="lm-container">
	<h1>Lernmethoden</h1>
	<p class="subtitle">Bewährte Techniken für effizientes Lernen</p>

	<div class="lm-grid">
		{#each data.learningMethods as method (method._id)}
			<LearningMethodCard {method} />
		{/each}
	</div>
</div>

<style>
	.lm-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 { font-size: 1.9rem; margin-bottom: 0.25rem }
	.subtitle { color:#666; margin-bottom:1.5rem }

	.lm-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (max-width:800px){
		.lm-grid{grid-template-columns:1fr}
	}
</style>