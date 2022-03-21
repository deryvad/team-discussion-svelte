<script>
    import {fruits} from "../js/store.js";
    import List from "./list.svelte";

    let fruitname = "";
    let fruitlist = [];
    fruits.subscribe(value => { fruitlist = value});

    let AddFruit = () => {    
        let fruit = {id: fruitlist.length + 1, text: fruitname};
        fruits.update((fruits) => ([...fruits, fruit]));
        fruitname = "";
    };

    let HandleEnter = (e)=>{
        if(e.keyCode == 13 ) AddFruit();
    }
</script>

<h1>Fruit List</h1>
<div>
    <input type="text" placeholder="Enter fruit name..." bind:value={fruitname} on:keypress={HandleEnter} />
    <button on:click={AddFruit}>Add</button>
</div>
<List items={fruitlist}/>

<style>
    h1,div{
        font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
    }
    input[type="text"]{
        width:100%;
        max-width: 200px;
        padding: 10px 15px;
    }
    button{        
        padding: 10px 20px;
        cursor:pointer;
    }
</style>

