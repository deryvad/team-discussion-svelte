<script>
    import {history} from "../store.js";

    let activities = [];
    history.subscribe(value => {activities = value});

</script>

<div class="history">
    <h2>History</h2>
    {#each activities as activity}
        <div>{activity}</div>
    {/each}
</div>


<style>
    div.history{
        position:fixed;
        top: 70px;
        right: 30px;
    }
</style>