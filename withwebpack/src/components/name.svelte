<script>    
	export let name;
    $: x = name;
    let y = name;
</script>

<span>{name}</span>

<div>$: x = <span>{x}</span></div>
<div>let y = <span>{y}</span></div>

<style>
    span{
        color: red;
    }
</style>