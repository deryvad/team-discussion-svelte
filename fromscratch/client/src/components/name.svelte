<script>    
	export let name;
    $: x = name;
    $: y = name;
    $: z = x;
</script>

<span>{name}</span>

<div>The value of x is <span>{x}</span></div>
<div>The value of y is <span>{y}</span></div>
<div>The value of z is <span>{z}</span></div>

<style>
    span{
        color: red;
    }
</style>