import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCursor,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <i className="fas fa-tachometer-alt me-3"></i>,
  },
  {
    component: CNavItem,
    name: 'Places',
    to: '/PlacesList',
    icon: <i className="fas fa-map-marked-alt me-3"></i>,
    permission: 'places',
  },
  {
    component: CNavItem,
    name: 'Floors',
    to: '/FloorList',
    icon: <i className="fas fa-users me-3"></i>,
    permission: 'floors',
  },
  {
    component: CNavGroup,
    name: 'Categories',
    icon: <i className="fas fa-cogs me-3"></i>,
    items: [
      {
        component: CNavItem,
        name: 'Category',
        to: '/categorylist',
        icon: <i className="fas fa-list-alt me-3"></i>,
        permission: 'category',
      },

      {
        component: CNavItem,
        name: 'Category Wise Slots ',
        to: '/CategorySlotsList',
        icon: <i className="fas fa-layer-group me-3"></i>,
        permission: 'categoryWiseSlots',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Parking',
    to: '/parkingList',
    icon: <i className="fas fa-chart-line me-3"></i>,
    permission: 'parking',
  },
  {
    component: CNavGroup,
    name: 'Club',
    icon: <i className="fas fa-cogs me-3"></i>,
    items: [
      {
        component: CNavItem,
        name: 'Clubs',
        to: '/clubslist',
        icon: <i className="fas fa-users me-3"></i>,
        permission: 'clubs',
      },
      {
        component: CNavItem,
        name: 'Clubs Transaction',
        to: '/clubtransactionlist',
        icon: <i className="fas fa-exchange-alt me-3"></i>,
        permission: 'clubTransaction',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Tariffs',
    to: '/TariffsList',
    icon: <i className="fas fa-money-bill me-3"></i>,
    permission: 'tariff',
  },
  {
    component: CNavItem,
    name: 'Vehicle Amount',
    to: '/VehicleAmountList',
    icon: <i className="fas fa-car me-3"></i>,
    permission: 'vehicleAmount',
  },

  {
    component: CNavGroup,
    name: 'Role',
    icon: <i className="fas fa-user-shield me-3"></i>,
    items: [
      {
        component: CNavItem,
        name: 'Roles',
        to: '/roleslist',
        icon: <i className="fas fa-id-badge me-3"></i>,
        permission: 'roles',
      },
      {
        component: CNavItem,
        name: 'Role User',
        to: '/roleuserlist',
        icon: <i className="fas fa-user-tag me-3"></i>,
        permission: 'roleUser',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Migrations',
    to: '/MigrationsList',
    icon: <i className="fas fa-database me-3"></i>,
    permission: 'migrations',
  },
  {
    component: CNavItem,
    name: 'Sub Users',
    to: '/subUserslist',
    icon: <i className="fas fa-user me-3"></i>,
    permission: '',
  },
  {
    component: CNavGroup,
    name: 'Settings',
    icon: <i className="fas fa-cog me-3"></i>,
    items: [
      {
        component: CNavItem,
        name: 'Countries',
        to: '/countrieslist',
        icon: <i className="fas fa-users me-3"></i>,
        permission: 'countries',
      },
      {
        component: CNavItem,
        name: 'Password Reset',
        to: '/passwordreset',
        icon: <i className="fas fa-key me-3"></i>,
        permission: 'passwordReset',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'RFD  Vehicles',
    to: '/rfdvehicles',
    icon: <i className="fas fa-car-side me-3"></i>,
    permission: 'rfdVehicles',
  },
]

export default _nav
