<script>
    export let value;
    export let placeholder;
</script>

<input type="text" placeholder={placeholder} bind:value={value}>

<style>
    input{
        padding: 10px 15px;
        border: 1px solid #333;
        box-sizing: border-box;
        width: 200px;
    }
</style>