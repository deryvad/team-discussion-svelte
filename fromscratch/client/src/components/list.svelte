<script>
    import {createEventDispatcher} from "svelte";
    export let users;
    const dispatch = createEventDispatcher();

    let deleteuser = (usertodelete) => {
        users = users.filter(user => user.peoplekey != usertodelete.peoplekey);  
        dispatch("delete", usertodelete);
    }
</script>

<div class="list">
    <div class="header">
        <div class="peoplekey">Peoplekey</div>
        <div class="firstname">First Name</div>
        <div class="lastname">Last Name</div>
        <div class="actions">Actions</div>
    </div>
    <div class="contents">
        {#each users as user}
        <div class="item">
            <div class="peoplekey">{user.peoplekey}</div>
            <div class="firstname">{user.firstname}</div>
            <div class="lastname">{user.lastname}</div>
            <div class="actions">
                <button on:click={deleteuser(user)}>Delete</button>
            </div> 
        </div>           
        {/each}
    </div>
</div>

<style>
    .list{
        width: 50%;
        margin:auto;
    }
    .header, .item{
        display:flex;
        border-top:1px solid #333;
        border-left:1px solid #333;
    }
    .header > div,
    .item > div {
        width: 25%;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #333;
        border-top:0;
        border-left:0;
    }
</style>