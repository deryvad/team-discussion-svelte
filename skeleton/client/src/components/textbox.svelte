<script>
    export let placeholder;
    export let value;
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