// Sample data
const server_data = {
    collection: {
        title: "Movie List",
        type: "movie",
        version: "1.0",
        items: [
            {
                href: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings_(film_series)",
                data: [
                    { name: "name", value: "The Lord of the Rings", prompt: "Name" },
                    { name: "description", value: "The Lord of the Rings is a film series consisting of three high fantasy adventure films directed by Peter Jackson.", prompt: "Description" },
                    { name: "director", value: "Peter Jackson", prompt: "Director" },
                    { name: "datePublished", value: "2001-12-19", prompt: "Release Date" }
                ]
            },
            {
                href: "https://en.wikipedia.org/wiki/The_Hunger_Games_(film_series)",
                data: [
                    { name: "name", value: "The Hunger Games", prompt: "Name" },
                    { name: "description", value: "The Hunger Games film series consists of four science fiction dystopian adventure films based on The Hunger Games trilogy of novels.", prompt: "Description" },
                    { name: "director", value: "Gary Ross", prompt: "Director" },
                    { name: "datePublished", value: "2012-03-12", prompt: "Release Date" }
                ]
            },
            {
                href: "https://en.wikipedia.org/wiki/Game_of_Thrones",
                data: [
                    { name: "name", value: "Game of Thrones", prompt: "Name" },
                    { name: "description", value: "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss.", prompt: "Description" },
                    { name: "director", value: "Alan Taylor et al", prompt: "Director" },
                    { name: "datePublished", value: "2011-04-17", prompt: "Release Date" }
                ]
            }
        ]
    }
};

// TODO transformar los datos para que sean más fáciles de usar en Vue
const formattedMovies = server_data.collection.items.map(item => {
    let movie = {};
    item.data.forEach(entry => {
        movie[entry.name] = entry.value; // Guarda cada dato con su nombre
    });
    movie.href = item.href; // Agrega el enlace de Wikipedia
    return movie;
});

// TODO crear la aplicación Vue
const app = Vue.createApp({
    data() {
        return {
            movies: formattedMovies,  // Lista de películas
            selectedMovie: null        // Película seleccionada para edición
        };
    },
    methods: {
        selectMovie(movie) {
            this.selectedMovie = { ...movie }; // Copia de la película para editar
        },
        updateMovie() {
            let index = this.movies.findIndex(m => m.name === this.selectedMovie.name);
            if (index !== -1) {
                this.movies[index] = { ...this.selectedMovie }; // Guardamos los cambios
            }
            this.selectedMovie = null; // Cerramos el formulario de edición
        }
    }
});

// Componente edit-form
app.component("movie-item", {
    props: ["movie"],
    data() {
        return {
            isEditing: false, // Controla si se muestra el formulario o la info de la película
            tempMovie: {} // Objeto temporal para edición
        };
    },
    methods: {
        editMovie() {
            this.tempMovie = { ...this.movie }; // Crear una copia para edición
            this.isEditing = true; // Mostrar formulario
        },
        closeAndSaveMovie() {
            Object.assign(this.movie, this.tempMovie); // Guardar cambios en el objeto original
            this.isEditing = false; // Cerrar formulario y mostrar la info de la película
        }
    },
    template: `
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div class="card shadow-sm mb-4 w-100 movie-card">
                <div class="card-body d-flex flex-column">

                    <!-- mostrar la info de la peli si NO esta en modo edición -->
                    <div v-if="!isEditing">
                        <h5 class="card-title fw-bold">{{ movie.name }}</h5>

                        <p><strong>Name:</strong></p>
                        <p class="card-text">{{ movie.name }}</p>

                        <p><strong>Description:</strong></p>
                        <p class="card-text">{{ movie.description }}</p>

                        <p><strong>Director:</strong></p>
                        <p class="card-text">{{ movie.director }}</p>

                        <p><strong>Release Date:</strong></p>
                        <p class="card-text">{{ movie.datePublished }}</p>

                        <!-- Botones "Ver" y "Editar" alineados a la izquierda en una sola línea -->
                        <div class="mt-auto d-flex align-items-start gap-2">
                            <a :href="movie.href" target="_blank" class="btn btn-primary btn-sm">Ver</a>
                            <button @click="editMovie" class="btn btn-secondary btn-sm">Editar</button>
                        </div>
                    </div>

                    <!-- mostrar el form si esta en modo edición -->
                    <div v-else class="edit-form">
                        <h5 class="fw-bold">Editar Película</h5>

                        <label class="form-label">Nombre:</label>
                        <input v-model="tempMovie.name" type="text" class="form-control">

                        <label class="form-label mt-2">Descripción:</label>
                        <textarea v-model="tempMovie.description" class="form-control"></textarea>

                        <label class="form-label mt-2">Director:</label>
                        <input v-model="tempMovie.director" type="text" class="form-control">

                        <label class="form-label mt-2">Fecha de Estreno:</label>
                        <input v-model="tempMovie.datePublished" type="date" class="form-control">

                        <!-- botón cerrar -->
                        <div class="mt-3 d-flex align-items-start gap-2">
                            <button @click="closeAndSaveMovie" class="btn btn-primary btn-sm">Cerrar</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `
});

// Componente movie-list
app.component("movie-list", {
    props: ["movies"],
    template: `
        <div class="row">
            <movie-item 
                v-for="movie in movies" 
                :key="movie.name" 
                :movie="movie" 
                @edit="$emit('edit', movie)">
            </movie-item>
        </div>
    `
});

// Registrar los componentes globalmente
app.component("edit-form", {
    props: ["movie"],
    template: `
        <div v-if="movie" class="card p-3 mt-4">
            <h4 class="fw-bold">Editar Película</h4>

            <label class="form-label">Nombre:</label>
            <input v-model="movie.name" type="text" class="form-control">

            <label class="form-label mt-2">Descripción:</label>
            <textarea v-model="movie.description" class="form-control"></textarea>

            <label class="form-label mt-2">Director:</label>
            <input v-model="movie.director" type="text" class="form-control">

            <label class="form-label mt-2">Fecha de Estreno:</label>
            <input v-model="movie.datePublished" type="date" class="form-control">

            <button @click="$emit('update')" class="btn btn-success mt-3">Guardar</button>
        </div>
    `
});

app.component('item-data', {
    props: ["item"],
    template: `
        <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p><strong>Director:</strong> {{ item.director }}</p>
            <p><strong>Release Date:</strong> {{ item.datePublished }}</p>
            <a :href="item.href" target="_blank">More Info</a>
        </div>
    `
});

// Montar la aplicación en el elemento con id 'app'
app.mount("#app");
