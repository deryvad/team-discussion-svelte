<script>    
	import Link from "svelte-navigator/src/Link.svelte";
    export let appname;
</script>
<header>
    <span class="title">
       
    </span>
</header>

<header>
    <span class="logo">
        <img src="/images/flywheel_logo.png" alt="">
    </span>
    <span class="title">{appname}</span>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
</header>

<style lang="scss">
	@import '../vars';
    header{
		font-size: $font-lg;
		background: $black;
		color: $white;
		line-height: 50px;
		padding: 0 20px;

        .logo{
            display:inline-block;
            width:30px;
            position:relative;
            top:5px;
            img{
                width: 100%;    
            }
        }
        
        .title{
            text-transform: uppercase;
            font-weight: bold;
        }
	}

	header :global(a:link){
		color:$white;
		text-decoration: none;
		margin-left:40px;
        font-size: $font-sm;
	}
</style>