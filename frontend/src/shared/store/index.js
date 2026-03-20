import { createStore } from 'vuex'
import auth from '@/features/auth/store/index.js'
import products from '@/features/products/store/index.js'
import inventory from '@/features/inventory/store/index.js'
import suppliers from '@/features/suppliers/store/index.js'
import clients from '@/features/clients/store/index.js'
import vendors from '@/features/vendors/store/index.js'
import sites from './modules/sites.js'
import reports from './modules/reports.js'
import loading from './modules/loading.js'

export default createStore({
  modules: {
    auth,
    products,
    inventory,
    suppliers,
    clients,
    vendors,
    sites,
    reports,
    loading
  }
})
