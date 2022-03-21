<script>
    import { Link } from "svelte-navigator";
	export let appname;
</script>
<header>
	<span class="title">{appname}</span>
    <!-- Using anchor tags causes the page to load -->
    <!-- <a href="/">Home</a>
    <a href="/activity">Activity</a> -->
    <!-- Using LINK just does client side routing -->
    <Link to="/">Home</Link>
    <Link to="/activity">Activity</Link>
</header>

<style>
	header{
		font-size: 1.5em;
		background: #333;
		color:#fff;
		line-height: 50px;
		padding: 0 20px;
	}

    .title{
        text-transform: uppercase;
        font-weight: bold;
    }
    
    header :global(a:link){
        font-size: 0.7em;
        margin-left: 30px;
        color:#fff;
        text-decoration:none;
    }
</style>
