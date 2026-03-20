import { createStore } from 'vuex'
import auth from './modules/auth'
import products from './modules/products'
import inventory from './modules/inventory'
import suppliers from './modules/suppliers'
import clients from './modules/clients'
import vendors from './modules/vendors'
import users from './modules/users'
import dashboard from './modules/dashboard'
import sites from './modules/sites'
import reports from './modules/reports'

export default createStore({
  modules: {
    auth,
    products,
    inventory,
    suppliers,
    clients,
    vendors,
    users,
    dashboard,
    sites,
    reports
  }
})
