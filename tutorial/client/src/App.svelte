<script>
	export let appname;
	document.title = appname;

	import {Router, Route, Link} from "svelte-navigator";
	import Home from "./pages/home.svelte";
	import About from "./pages/about.svelte";
	import History from "./components/history.svelte";

</script>


<Router>
	<header>
		<span class="title">{appname}</span>
		<Link to="/">Home</Link>
		<Link to="/about">About</Link>
	</header>

	<Route path="/">
		<Home/>
	</Route>
	<Route path="/about">
		<About/>
	</Route>
	<History />
</Router>

<style>
	:global(html,body){
		margin:0;
		padding:0;
		font-size:16px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
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
		color:white;
		text-decoration: none;
		margin-left:40px;
	}
</style>