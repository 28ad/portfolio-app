import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Account from '../views/Account.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Projects from '../views/Projects.vue'
import ResetPassword from '../views/ResetPassword.vue'
import CreateProject from '../views/CreateProject.vue'
import ViewProject from '../views/ViewProject.vue'
import SearchUsers from '../views/SearchUsers.vue'
import UserProfile from '../views/UserProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projects/:projectId',
      name: 'view-project',
      component: ViewProject
    },
    {
      path: '/projects/create-project',
      name: 'create-project',
      component: CreateProject
    },
    {
      path: '/search/results/:param',
      name: 'search',
      component: SearchUsers
    },
    {
      path: '/user/:userId',
      name: 'user-profile',
      component: UserProfile
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword
    }
  ]
})

export default router
