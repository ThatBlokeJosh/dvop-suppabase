<script lang="ts">
    import { fly } from "svelte/transition";
    import { db, Delete, Insert,ToggleCompleted } from "../utils/db.svelte";
    import type { Task } from "../utils/types";

    let newTask: Task = $state({name: "", description: "", completed: false})

    async function Submit(e:SubmitEvent) {
      e.preventDefault()
      await Insert(newTask) 
      newTask = {name: "", description: "", completed: false}
    }
</script>

<title>uppaTroopa</title>

<div class="grid gap-5 p-[5vw] h-[100vh]">
  <form class="flex items-center gap-5 h-fit" onsubmit={async (e) => {await Submit(e)}}>
    <label class="italic font-bold text-orange-500" for="name">Name:</label>
    <input bind:value={newTask.name} placeholder="Say hello" class="bg-transparent placeholder-[#E3E5E8] underline decoration-2 decoration-orange-500 font-bold" name="name" type="text">
    <label class="italic font-bold text-orange-500" for="desc">Description:</label>
    <input placeholder="Greet world!" bind:value={newTask.description} class="bg-transparent placeholder-[#E3E5E8] decoration-2 decoration-orange-500 underline font-bold" name="desc" type="text">
    <button type="submit" class="text-xl font-extrabold italic text-orange-500">+</button>
  </form>
  <div class="grid h-[100%] w-[100%] overflow-auto">
    <div class="grid h-fit w-fit gap-[5vh]">
      {#each $db.values() as task}
	<div class="flex items-center justify-center gap-5 w-fit">
	  <p class="text-lg font-bold italic text-orange-500">{task.id})</p>
	  <div class="grid">
	    <h1 class="text-4xl font-bold decoration-orange-500 decoration-4 {task.completed ? 'line-through' : ''}">{task.name}</h1>
	    <p class="text-xl">{task.description}</p>
	  </div>
	  <button onclick={async () => {
	    await ToggleCompleted(task)
	  }} class="text-xl font-bold italic underline text-orange-500">{task.completed ? 'uncomplete' : 'complete'} </button>
	  <button onclick={async () => {
	    await Delete(task.id!)
	  }} class="text-xl font-bold italic underline text-orange-500">delete</button>
	</div>
      {/each}
    </div>
  </div>
</div>
