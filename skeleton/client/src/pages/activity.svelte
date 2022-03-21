<script>
    import {history} from '../store.js';
    let list = [];
    history.subscribe(value => { list = value});

    $: console.log(history);
</script>

{#each list as item}
    <div>{item}</div>    
{/each}