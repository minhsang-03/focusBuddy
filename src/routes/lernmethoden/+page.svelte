<script>
  import LearningMethodCard from "$lib/components/LearningMethodCard.svelte";

  /** @type {{ learningMethods: Array<{_id:string,name:string,description?:string,defaultWorkMinutes?:number,defaultBreakMinutes?:number,icon?:string,iconColor?:string,steps?:string[],notificationText?:string}> }} */
  export let data;
</script>

<div class="container py-4">
  <h1 class="mb-1">Lernmethoden</h1>
  <p class="text-muted mb-4">Bewährte Techniken für effizientes Lernen</p>

  <div class="row row-cols-1 row-cols-md-2 g-4">
    {#each data.learningMethods as method (method._id)}
      <div class="col">
        <LearningMethodCard {method} />
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    max-width: 1100px;
  }
</style>
