<script>
	/** @type {{ learningMethods: Array<{_id:string,name:string,description?:string,defaultWorkMinutes?:number,defaultBreakMinutes?:number}> }} */
	export let data;
</script>

<div class="lm-container">
	<h1>Lernmethoden</h1>
	<p class="subtitle">Bewährte Techniken für effizientes Lernen</p>

	<div class="lm-grid">
		{#each data.learningMethods as method (method._id)}
			<article class="lm-card">
				<div class="lm-icon">📘</div>
				<div class="lm-content">
					<h3>{method.name}</h3>
					<p class="lm-desc">{method.description}</p>

					<div class="lm-steps">
						<strong>So funktioniert's:</strong>
						<ol>
							{#if method.name === 'Pomodoro' || method.name.toLowerCase().includes('pomodoro')}
								<li>Wählen Sie eine Aufgabe</li>
								<li>Stellen Sie einen Timer auf {method.defaultWorkMinutes || 25} Minuten</li>
								<li>Arbeiten Sie konzentriert bis der Timer klingelt</li>
								<li>Machen Sie eine {method.defaultBreakMinutes || 5}-minütige Pause</li>
								<li>Nach 4 Pomodoros machen Sie eine längere Pause (15-30 Minuten)</li>
							{:else}
								<li>Lesen Sie die Beschreibung oben</li>
								<li>Wenden Sie die Methode beim Lernen an</li>
								<li>Passen Sie Zeiten nach Bedarf an</li>
							{/if}
						</ol>
					</div>

					<div class="lm-actions">
						<a class="btn-apply" href={`/timer?method=${method._id}`}>Im Timer anwenden</a>
					</div>
				</div>
			</article>
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

	.lm-card {
		display: flex;
		gap: 1rem;
		background: white;
		border-radius: 12px;
		padding: 1.25rem;
		border: 1px solid #e6e9ee;
		align-items: flex-start;
	}

	.lm-icon {
		width: 56px;
		height: 56px;
		background: #eef6ff;
		border-radius: 12px;
		display:flex;align-items:center;justify-content:center;font-size:1.6rem
	}

	.lm-content h3 { margin:0 0 0.5rem 0 }
	.lm-desc { color:#444; margin-bottom:0.75rem }

	.lm-steps ol { margin:0.5rem 0 1rem 1.25rem }

	.lm-actions { margin-top:0.5rem }
	.btn-apply {
		display:inline-block;padding:0.75rem 1rem;border-radius:8px;background:#0b1220;color:white;text-decoration:none;
	}

	@media (max-width:800px){
		.lm-grid{grid-template-columns:1fr}
	}
</style>