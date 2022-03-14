
<script>    
    export let items;
    export let selected;

    function select(item){
        selected = item.text;
    }
</script>
<ul>
    {#each items as item}
    <li on:click="{select(item)}" value={item.id}>{item.text}</li>
    {/each}
</ul>