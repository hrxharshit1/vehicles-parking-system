import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="custom-sidebar"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={{
        backgroundColor: '#e8eae3',
      }}
    >
      <CSidebarHeader style={{ borderBottom: '2px solid #E8EAE3', backgroundColor: '#e8eae3' }}>
        <CSidebarBrand
          to="/"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <div className="sidebar-header border-bottom">
            <strong
              style={{
                fontSize: '2.5rem',
                color: '#fa2742',
                fontWeight: 'bold',
                marginTop: '5px',
              }}
            >
              VPS
            </strong>
          </div>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {/* Sidebar Nav */}
      <div style={{ backgroundColor: '#e8eae3', overflowY: 'auto', flex: '1' }}>
        <AppSidebarNav items={navigation} />
      </div>

      <CSidebarFooter
        className="border-top d-none d-lg-flex"
        style={{ borderTop: '2px solid #fa2742', backgroundColor: '#e8eae3' }}
      >
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>

      {/* Styles for hover, active, and default nav colors */}
      <style>
        {`
          .custom-sidebar .nav-link {
            color:#373833 !important;
          }

          .custom-sidebar .nav-link:hover {
            background-color: #fa2742 !important;
            color:rgb(255, 255, 255) !important;
          }

          .custom-sidebar .nav-link.active {
            background-color: #fa2742 !important;
            color: #fff !important;
            font-weight: bold;
          }

          .custom-sidebar .nav-group-toggle:hover {
            background-color: #fa2742 !important;
            color: #ffffff !important;
          }

          .custom-sidebar .nav-item:hover {
            background-color: #fa2742 !important;
          }
          
        `}
      </style>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
