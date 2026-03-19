import { element } from 'prop-types'
import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Theme
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Categories
// const
// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Charts
const Charts = React.lazy(() => import('./views/charts/Charts'))

//pages
const PlacesList = React.lazy(() => import('./views/pages/Places/PlacesList'))
const Places = React.lazy(() => import('./views/pages/Places/Places'))

const FloorList = React.lazy(() => import('./views/pages/Floor/FloorList'))
const Floors = React.lazy(() => import('./views/pages/Floor/AddFloor'))

const CategoryList = React.lazy(() => import('./views/pages/Category/CategoryList'))
const Category = React.lazy(() => import('./views/pages/Category/Category'))
const CategorySlotsList = React.lazy(() => import('./views/pages/Category/CategorySlotsList'))
const CategorySlots = React.lazy(() => import('./views/pages/Category/CategorySlots'))

const ClubsList = React.lazy(() => import('./views/pages/Club/ClubsList'))
const Clubs = React.lazy(() => import('./views/pages/Club/Clubs'))
const ClubTransactionList = React.lazy(() => import('./views/pages/Club/ClubsTransactionList'))
const ClubTransaction = React.lazy(() => import('./views/pages/Club/ClubsTransaction'))
const TariffsList = React.lazy(() => import('./views/pages/Tariffs/TariffsList'))
const Tariffs = React.lazy(() => import('./views/pages/Tariffs/Tariffs'))
const VehicleAmountList = React.lazy(() => import('./views/pages/VehicleAmount/VehicleAmountList'))
const VehicleAmount = React.lazy(() => import('./views/pages/VehicleAmount/VehicleAmount'))
const RoleList = React.lazy(() => import('./views/pages/Role/RoleList'))
const Roles = React.lazy(() => import('./views/pages/Role/Role'))
const RoleUserList = React.lazy(() => import('./views/pages/Role/RoleUserList'))
const RoleUser = React.lazy(() => import('./views/pages/Role/RoleUser'))
const MigrationsList = React.lazy(() => import('./views/pages/Migrations/MigrationsList'))
const Migrations = React.lazy(() => import('./views/pages/Migrations/Migrations'))
const CountriesList = React.lazy(() => import('./views/pages/Countries/CountriesList'))
const Countries = React.lazy(() => import('./views/pages/Countries/Countries'))
const LanguagesList = React.lazy(() => import('./views/pages/Role/RoleList'))
const Languages = React.lazy(() => import('./views/pages/Role/Role'))
const subUsers = React.lazy(() => import('./views/pages/SubUsers/SubUsers'))
const subUsersList = React.lazy(() => import('./views/pages/SubUsers/SubUsersList'))
const rfdVehicles = React.lazy(() => import('./views/pages/RDF/RfdVehicle'))
const Parking = React.lazy(() => import('./views/pages/Parking/Parking'))
const ParkingList = React.lazy(() => import('./views/pages/Parking/ParkingList'))
const PasswordReset = React.lazy(() => import('./views/pages/PasswordReset/PasswordReset'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/charts', name: 'Charts', element: Charts },

  { path: '/places', name: 'Places', element: Places },
  { path: '/editPlaces/:id', name: 'Places', element: Places },
  { path: '/PlacesList', name: 'Places', element: PlacesList },

  { path: '/Floors', name: 'Floors', element: Floors },
  { path: '/editFloors/:id', name: 'Floors', element: Floors },
  { path: '/FloorList', name: 'Floors', element: FloorList },

  { path: '/CategoryList', name: 'CategoryList', element: CategoryList },
  { path: '/category', name: 'Category', element: Category },
  { path: '/editCategory/:id', name: 'Category', element: Category },
  { path: '/CategorySlotsList', name: 'Category Slots List', element: CategorySlotsList },
  { path: '/categoryslot', name: 'Category Slots', element: CategorySlots },
  { path: '/categoryslotEdit/:id', name: 'Category Slots', element: CategorySlots },

  { path: '/clubslist', name: 'Club List', element: ClubsList },
  { path: '/clubs', name: 'Clubs', element: Clubs },
  { path: '/editClubs/:id', name: 'Clubs Edit', element: Clubs },
  { path: '/clubtransactionlist', name: 'Club Transaction List', element: ClubTransactionList },
  { path: '/clubtransaction', name: 'Club Transaction', element: ClubTransaction },
  { path: '/editClubtransaction/:id', name: 'Club Transaction', element: ClubTransaction },

  { path: '/parkingList', name: 'Parking List', element: ParkingList },
  { path: '/parking/:id', name: 'New Parking', element: Parking },
  { path: '/editParking/:id', name: 'Edit PArking', element: Parking },

  { path: '/TariffsList', name: 'Tariffs List', element: TariffsList },
  { path: '/tariffs', name: 'Tariffs', element: Tariffs },
  { path: '/tariffsEdit/:id', name: 'Tariffs', element: Tariffs },

  { path: '/VehicleAmountList', name: 'Vehicle Amount List', element: VehicleAmountList },
  { path: '/vehicleAmount', name: 'Vehicle Amount', element: VehicleAmount },
  { path: '/editVehicleAmount/:id', name: 'Vehicle Amount', element: VehicleAmount },

  { path: '/roleslist', name: 'Roles List', element: RoleList },
  { path: '/roles', name: 'New Role', element: Roles },
  { path: '/editRoles/:id', name: 'Edit Role', element: Roles },
  { path: '/roleuserlist', name: 'Role List', element: RoleUserList },
  { path: '/roleuser', name: 'Role User', element: RoleUser },
  { path: '/editRoleuser/:id', name: 'Role User', element: RoleUser },

  { path: '/MigrationsList', name: 'Migrations List', element: MigrationsList },
  { path: '/migrations', name: 'Migrations', element: Migrations },
  { path: '/editMigrations/:id', name: 'Migrations', element: Migrations },

  { path: '/subUserslist', name: 'Subuser List', element: subUsersList },
  { path: '/subUsers', name: 'subuser', element: subUsers },
  { path: '/editSubUsers/:id', name: 'subuser', element: subUsers },

  { path: '/countrieslist', name: 'Places List', element: CountriesList },
  { path: '/countries', name: 'Places List', element: Countries },
  { path: '/languageslist', name: 'Places List', element: LanguagesList },
  { path: '/languages', name: 'Places List', element: Languages },
  { path: '/rfdvehicles', name: 'RFD Vehicle', element: rfdVehicles },
  { path: '/passwordreset', name: 'Password Reset', element: PasswordReset },
]

export default routes
