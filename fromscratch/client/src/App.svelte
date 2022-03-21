<script>
	export let appname;
	document.title = appname;

	//import {Router, Route, Link} from "svelte-navigator";
	import Router from "svelte-navigator/src/Router.svelte";
	import Route from "svelte-navigator/src/Route.svelte";
	import Home from "./pages/home.svelte";
	import About from "./pages/about.svelte";
	import History from "./components/history.svelte";
	import Header from "./components/header.svelte";

</script>


<Router>
	<Header appname={appname}></Header>
	<Route path="/">
		<Home/>
	</Route>
	<Route path="/about">
		<About/>
	</Route>
	<History />
</Router>

<div class="parent">
	<div class="child">
		hello
	</div>
</div>

<style lang="scss">
	@import './vars';
	.parent{
		.child{
			color: $red;	
		}
	}
	:global(html,body){
		margin:0;
		padding:0;
		font-size:16px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}	
</style>