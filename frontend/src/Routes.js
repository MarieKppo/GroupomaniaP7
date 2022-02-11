import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Profile from './views/Profile.vue'
import Feed from './views/GlobalFeed.vue'
// import Comment from './views/Comment.vue'
import NotFound from './views/NotFound.vue'


export default [ // tableau d'objets : 1 objet = 1 route
    // {
    //     path: '/', component: Login}, 
    // {path: '/signup', component: SignUp},
    // {path: '/profile', component: Profile},
    // {path: '/feed', component: Feed},
    // {path: '/:pathMatch(.*)*', component: NotFound},

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
        // ,
        // {
        //     path: '/post/:postId', 
        //     name: 'Comment',
        //     component: Comment
        // }
    ]
