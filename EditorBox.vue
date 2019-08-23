<template>
    <div class="container">
        <div class="editorBoxOptionsUser"> <!-- The viewer and its search functions have to work before allowing editing. Desired tool though! -->
            <a id="link" href="http://localhost:8084" target="_blank" rel="noopener noreferrer">Open Editor</a> <!-- link to the viewer -->
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.editorBoxOptionsUser {
    font-family: "Source Sans Pro", sans-serif;
    color: black;
    background-color: rgb(225, 112, 0);
    z-index: 400;
    bottom: 28%;
    left: 1%;
    position: absolute;
    padding: 1%;
    border-style: solid;
    border-color: darkblue;
}
a {
    color: white;
    font-size: 0.85vw;;
    font-weight: bold;
}
</style>
