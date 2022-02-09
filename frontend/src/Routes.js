import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Profile from './views/Profile.vue'
import Feed from './views/GlobalFeed.vue'
import NotFound from './views/NotFound.vue'


export default [ // tableau d'objets : 1 objet = 1 route
    {path: '/', component: Login}, 
    {path: '/signup', component: SignUp},
    {path: '/profile', component: Profile},
    {path: '/feed', component: Feed},
    {path: '/:pathMatch(.*)*', component: NotFound}
]
