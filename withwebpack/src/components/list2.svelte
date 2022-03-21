
<script>    
    export let items;
    export let selected;

    function select(item){
        selected = item.text;
    }
</script>
<ul>
    {#each items as item, i}
    <li on:click="{select(item)}" value={item.id}>{(i+1) + ". " + item.text}</li>
    {/each}
</ul>