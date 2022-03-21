
<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import List from '../components/list.svelte';
    import Textbox from '../components/textbox.svelte';
    import {history} from '../store.js';

    let users = [];
    let loadingusers = true;

    onMount(async () => {
        const res = await fetch('http://localhost:5000/api/public/user', {
			method: 'GET'
		})
        users = await res.json()
        loadingusers = false;
    });

    let randomIntFromInterval = (min, max) => { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let addinguser = false;
    let firstname = "";
    let lastname = "";
    $: fullname = `${firstname} ${lastname}`;
    let adduser = async () => {
        addinguser=true;
        let user = {
            peoplekey: randomIntFromInterval(1, 100000),
            firstname: firstname,
            lastname: lastname
        }
        const res = await fetch('http://localhost:5000/api/public/user', {
			method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
		})
        users = await res.json()
        addinguser = false;
        history.update((history) => ([`${fullname} was added to the list.`, ...history]));
        firstname = "";
        lastname = ""
        console.log(history);
    }


    let deleteuser = async (event) => {
        let usertodelete = event.detail;
        const res = await fetch('http://localhost:5000/api/public/user/' + usertodelete.peoplekey, {
			method: 'DELETE'
		})
        users = await res.json()
        history.update((history) => ([`${usertodelete.firstname} ${usertodelete.lastname} was removed from the list.`, ...history]));
    }
</script>

<div class="adduser">
    <Textbox placeholder="First Name..." bind:value={firstname} />
    <Textbox placeholder="Last Name..." bind:value={lastname} />
    <button on:click={adduser}>Add {fullname}</button>
    {#if addinguser}
        <span>adding user...</span>
    {/if}
</div>

{#if !loadingusers}
<List users={users} on:delete={deleteuser}/>
{:else}
<div style="text-align:center;" in:fade={{duration: 500}}>loading users...</div>
{/if}

<style>
    .adduser{
        margin:auto;
        width: 50%;
        margin-bottom: 20px;
    }
    button{        
        padding: 10px 15px;
        border: 1px solid #333;
        box-sizing: border-box;
        min-width: 100px;
    }
</style>