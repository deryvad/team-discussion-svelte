<script>
	import Name from './components/name.svelte';
	let name = 'World';
</script>

<div>
	<span>Name: </span>
	<input type="text" bind:value="{name}" palceholder="Type the name"/>
</div>

<h1>Hello <Name name="{name}" /></h1>

<style>
	h1 {
		font-family: 'Comic Sans MS';
	}
</style>