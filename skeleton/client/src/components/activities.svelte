<script>
    import {history} from '../store.js';
    let list = [];
    history.subscribe(value => { list = value});
</script>

<div class="cont">
    <div>Activities</div>
    {#each list as item}
        <div>{item}</div>    
    {/each}
</div>

<style>
    .cont{
        position: fixed;
        right: 20px;
        top: 70px;
    }
</style>