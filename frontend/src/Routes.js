import LoginPage from './views/Login.vue'
import SignUp from './components/SignUp/SignUp'


export default [ // tableau d'objets : 1 objet = 1 route
    {path: '/LoginPage', component: LoginPage}, //ajouter une condition si connecté = feed
    // {path: '/login', component: Login},
    {path: '/signup', component: SignUp}

]