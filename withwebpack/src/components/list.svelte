
<script>
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
    
    export let items;

    function select(item){
        dispatch('select', item.text);
    }
</script>
<ul>
    {#each items as item}
    <li on:click="{select(item)}" value={item.id}>{item.text}</li>
    {/each}
</ul>