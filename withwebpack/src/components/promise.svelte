<script>
    let promise, color = "#000";
    let randomizeColor = () => {               
        function randomIntFromInterval(min, max) { 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        return new Promise((resolve, reject)=>{
            let r = 0, g = 0, b = 0;
            let interval = setInterval(()=>{
                r = randomIntFromInterval(1, 255);
                g = randomIntFromInterval(1, 255);
                b = randomIntFromInterval(1, 255);
                color = `rgb(${r},${g},${b})`;
            }, 100);
            setTimeout(()=>{
                clearInterval(interval);
                resolve(color);
            }, 3000);
        });
    };
    promise = randomizeColor();    
    let btnclick = ()=>{promise = randomizeColor()};
</script>

<div>
    <div class="color" style="height: 30px; width: 100px; background:{color};"></div>
    {#await promise}
        <p>...randomizing...</p>
    {:then finalcolor}
        <p>The color is <span style="color:{finalcolor};">{finalcolor}</span></p>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
    
    <button on:click="{btnclick}">Randomize Color</button>
</div>