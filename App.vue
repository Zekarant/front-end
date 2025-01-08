<template>
    <div id="app">
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24"
                        class="d-inline-block align-text-top">
                    Bootstrap
                </a>
            </div>
        </nav>

        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
/* Style basique */
#app {
    font-family: Arial, sans-serif;
    text-align: center;
}

header {
    background-color: #333;
    padding: 1rem;
}

header ul {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
}

header li {
    margin: 0 1rem;
}

header a {
    color: white;
    text-decoration: none;
}

header a.router-link-active {
    font-weight: bold;
}

main {
    padding: 2rem;
}
</style>
