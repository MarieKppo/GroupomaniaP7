import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Profile from './views/Profile.vue'
import Feed from './views/GlobalFeed.vue'
import NotFound from './views/NotFound.vue'


export default [ 
    {
        path: '/', 
        name: 'Login',
        component: Login
    },
    {
        path: '/signup', 
        name: 'SignuUp',
        component: SignUp
    },
    {
        path: `/profile/:id`, 
        name:'Profile',
        component: Profile
    },
    {
        path: '/feed', 
        name: 'Feed',
        component: Feed
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Not Found',
        component: NotFound
    }
]
