<script>
    import {onMount} from "svelte";
    import List from "../components/list.svelte";
    import Textbox from "../components/textbox.svelte";
    import {history} from "../store.js";
    let users = [];

    onMount(async ()=>{
        const response = await fetch('http://localhost:5000/api/public/user', {
            method: "GET"
        });
        users = await response.json();
        console.log(users);
    });

    let isdeleting = false;
    let deleteuser = async (event) => {
        if(isdeleting) return;
        isdeleting = true;
        let usertodelete = event.detail;
        history.update((history) => ([`${usertodelete.firstname} ${usertodelete.lastname} was removed from the list.`, ...history]));
        const response = await fetch('http://localhost:5000/api/public/user/' + usertodelete.peoplekey, {
            method: "delete"
        });
        await response.json();
        isdeleting = false;
    }

    let firstname = "";
    let lastname = "";
    $: fullname = `${firstname} ${lastname}`;
    
    let randomIntFromInterval = (min, max) => { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    let addinguser = false;
    let adduser = async () => {
        if(addinguser) return;
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
        firstname = "";
        lastname = "";
        history.update((history) => ([`${fullname} was added to the list.`, ...history]));
    }
</script>

<div class="adduser">
    <Textbox placeholder="First Name..." bind:value={firstname}/>
    <Textbox placeholder="Last Name..." bind:value={lastname}/>
    <button on:click={adduser}>Add {fullname}</button>
    {#if addinguser}
        <span>adding user...</span>
    {/if}
</div>
<List users={users} on:delete={deleteuser} />

<style>
    .adduser{
        width:50%;
        margin: 40px auto;
    }
</style>