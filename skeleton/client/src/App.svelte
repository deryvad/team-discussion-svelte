<script>
	//passing properties
	export let appname;

	//create components
	import Header from "./components/header.svelte";

	//routing. need to install the module
  	import { Router, Route } from "svelte-navigator";
	import Home from "./pages/home.svelte";
	import Activity from "./pages/activity.svelte";

	//activities
	import History from "./components/activities.svelte";


</script>

<Router>
	<Header appname={appname}/>
	<div class="container">
		<Route path="/">
			<Home/>
		</Route>
		<Route path="/activity">
			<Activity/>
		</Route>
	</div>
	<History />
</Router>

<style>
	:global(html,body){
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 16px;
		margin: 0;
		padding:0
	}

	.container{
		padding:20px;
	}
</style>