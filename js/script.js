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

const formattedMovies = server_data.collection.items.map(item => {
    let movie = {};
    item.data.forEach(entry => {
        movie[entry.name] = entry.value; 
    });
    movie.href = item.href; 
    return movie;
});

const app = Vue.createApp({
    data() {
        return {
            title: server_data.collection.title, 
            movies: formattedMovies 
        };
    }
});

app.component('item-data', {
    props: ["movie"],
    data() {
        return {
            isEditing: false,
            tempMovie: { ...this.movie }
        };
    },
    methods: {
        editMovie() {
            this.tempMovie = { ...this.movie };
            this.isEditing = true;
        },
        saveMovie() {
            Object.assign(this.movie, this.tempMovie);
            this.isEditing = false;
        }
    },
    template: `
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div class="card shadow-sm mb-4 w-100 movie-card">
                <div class="card-body d-flex flex-column">
                    
                    <!-- Modo Visualización -->
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

                        <!-- Botones alineados a la izquierda -->
                        <div class="mt-auto d-flex align-items-start gap-2">
                            <a :href="movie.href" target="_blank" class="btn btn-primary btn-sm">Ver</a>
                            <button @click="editMovie" class="btn btn-secondary btn-sm">Editar</button>
                        </div>
                    </div>

                    <!-- Modo Edición -->
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

                        <!-- Botón "Cerrar" que guarda los cambios -->
                        <div class="mt-3 d-flex align-items-start gap-2">
                            <button @click="saveMovie" class="btn btn-primary btn-sm">Cerrar</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `
});

// Montar la aplicación en el elemento con id 'app'
app.mount("#app");
