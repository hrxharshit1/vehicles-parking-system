import React, { useEffect, useState } from 'react'
import './SubUsersList.css'
import { Link } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10
const API_URL = 'http://127.0.0.1:8000/subUserAll'

const SubUsersList = () => {
  const [subUsers, setSubUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchSubUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setSubUsers(data)
    } catch (error) {
      console.error('Error fetching sub-users:', error.message)
      alert('Authentication error or failed to fetch data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubUsers()
  }, [])

  const filteredUsers = subUsers.filter((user) =>
    (user?.customerName ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getUserStatus = (user) => {
    if (user.admin) return 'Admin'
    if (user.staff) return 'Staff'
    return ''
  }

  const getAccountStatus = (user) => {
    return user.status ? 'Active' : 'Inactive'
  }

  return (
    <>
      <div className="category-box">
        <Link to="/SubUsers">
          <span className="add-btn"> Add Sub User</span>
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
          <h2>Sub Users List</h2>
        </div>

        {loading ? (
          <p>Loading sub users...</p>
        ) : (
          <div className="table-responsive">
            <table className="product-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>UID</th>
                  <th>Customer Name</th>
                  <th>Company Name</th>
                  <th>GST No</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>User Status</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{`#${user.id}`}</td>
                    <td>{user.customerName || ''}</td>
                    <td>{user.companyName || ''}</td>
                    <td>{user.gstNo || ''}</td>
                    <td>{user.email || ''}</td>
                    <td>{user.mobile || ''}</td>
                    <td>{getUserStatus(user)}</td>
                    <td>{getAccountStatus(user)}</td>
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
        )}

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}{' '}
            of {filteredUsers.length}
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

export default SubUsersList
