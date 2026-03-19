import React, { useState, useEffect } from 'react'
import './RoleList.css'
import { Link } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

// Sample list of products (can replace with real data)
const products = new Array(15).fill({
  uid: '#1',
  roleName: 'Admin',
  userName: 'John Doe',
})

const ITEMS_PER_PAGE = 10

const RoleList = () => {
  const [roles, setRoles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/roles/roleUser', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch roles')
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error.message)
      alert('Error loading roles. Please check your login.')
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const totalPages = Math.ceil(roles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = roles.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <>
      <div className="category-box">
        <Link to="/roles">
          <span className="add-btn"> Add Role </span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
      <div className="list-container">
        <div className="list-heading">
          <h2>Role List</h2>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>UID</th>
                <th> NAME</th>
                <th> DESCRIPTION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, i) => (
                <tr key={i}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{p.uid}</td>
                  <td>{p.roleName}</td>
                  <td>{p.userName}</td>
                  <td className="actions">
                    <button className="view">👁</button>
                    <button className="edit">✏️</button>
                    <button className="delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length}
          </span>
          <ul>
            <li onClick={() => goToPage(currentPage - 1)}>&lt;&lt;</li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </li>
            ))}
            <li onClick={() => goToPage(currentPage + 1)}>&gt;&gt;</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default RoleList
