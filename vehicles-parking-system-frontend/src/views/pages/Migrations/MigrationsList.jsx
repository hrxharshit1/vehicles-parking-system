import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './MigrationsList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const MigrationsList = () => {
  const [migrations, setMigrations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchMigrations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/migration/migrationsAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Not authenticated')
      const data = await response.json()
      setMigrations(data)
    } catch (error) {
      console.error('Fetch error:', error.message)
      alert('Failed to fetch. Please login.')
    }
  }

  useEffect(() => {
    fetchMigrations()
  }, [])

  const totalPages = Math.ceil(migrations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = migrations.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const currentPageIds = currentItems.map((item) => item.id)
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    }
  }

  const deleteMigration = async (id) => {
    if (!window.confirm('Delete this migration?')) return
    try {
      await fetch(`http://127.0.0.1:8000/migration/migrations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setMigrations((prev) => prev.filter((m) => m.id !== id))
    } catch (error) {
      console.error('Delete failed:', error.message)
    }
  }

  const deleteSelected = async () => {
    if (!window.confirm('Delete selected migrations?')) return
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://127.0.0.1:8000/migration/migrationsMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setMigrations((prev) => prev.filter((m) => !selectedIds.includes(m.id)))
      setSelectedIds([])
    } catch (error) {
      console.error('Bulk delete failed:', error.message)
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Delete all migrations?')) return
    try {
      await fetch('http://127.0.0.1:8000/migration/migrationsAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setMigrations([])
      setSelectedIds([])
    } catch (error) {
      console.error('Delete all failed:', error.message)
    }
  }

  return (
    <>
      <div className="category-box">
        <Link to="/migrations">
          <span className="add-btn">Add Migration</span>
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
          <h2>Migrations List</h2>
        </div>

        <div className="bulk-actions">
          <button onClick={deleteSelected} disabled={selectedIds.length === 0}>
            Delete Selected
          </button>
          <button onClick={deleteAll} disabled={migrations.length === 0}>
            Delete All
          </button>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      currentItems.length > 0 &&
                      currentItems.every((item) => selectedIds.includes(item.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>UID</th>
                <th>Migration</th>
                <th>Batch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td>{item.uid || item.id}</td>
                    <td>{item.migration}</td>
                    <td>{item.batch}</td>
                    <td className="actions">
                      <button className="view">👁</button>
                      <button
                        className="edit"
                        onClick={() => navigate(`/editMigrations/${item.id}`)}
                      >
                        ✏️
                      </button>
                      <button className="delete" onClick={() => deleteMigration(item.id)}>
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, migrations.length)} of {migrations.length}
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

export default MigrationsList
