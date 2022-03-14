<script>
	import Name from './components/name.svelte';
	import List from './components/list.svelte';
	import List2 from './components/list2.svelte';
	import Promise from './components/promise.svelte';
	let name = 'World';
	let list = [
		{ id: 1, text: "Apple" },
		{ id: 2, text: "Orange" },
		{ id: 3, text: "Banana" },
		{ id: 4, text: "Mango" }
	];


	let selecteditemfromlist1 = "";
	let handleSelect = (event) => {
		selecteditemfromlist1 = event.detail
	}
	
	let selectedfromlist2 = "";	
</script>

---------------------------------------------
<div>
	<br>
	<span>Name: </span>
	<input type="text" bind:value="{name}" palceholder="Type the name"/>
</div>
<h1>Hello <Name name="{name}" /></h1>

---------------------------------------------

<h1>This list use event dispatch</h1>
<List items={list} on:select={handleSelect}  />
<h1>
	Selected item is: <span style="color:red;">{selecteditemfromlist1}</span>
</h1>

---------------------------------------------

<h1>This list use binding</h1>
<List2 items={list} bind:selected={selectedfromlist2}  />
<h1>
	Selected item is: <span style="color:red;">{selectedfromlist2}</span>
</h1>
---------------------------------------------

<h1>Promises</h1>
<Promise />

---------------------------------------------


<style>
	h1 {
		font-family: 'Comic Sans MS';
	}
</style>