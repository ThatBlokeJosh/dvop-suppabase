<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="bg-[#111317] h-[100vh] w-[100vw] text-[#E3E5E8]">
  {@render children()}
</div>
