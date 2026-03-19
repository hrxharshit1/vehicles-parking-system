import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CountriesList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
const ITEMS_PER_PAGE = 10

const CountriesList = () => {
  const [countries, setCountries] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [clubs, setClubs] = useState([])

  const filteredClubs = clubs.filter((item) =>
    (item?.name ?? '').toLowerCase().includes((searchTerm ?? '').toLowerCase()),
  )
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/country/countriesAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch countries: Not authenticated')
      }
      const data = await response.json()
      setCountries(data)
    } catch (error) {
      console.error('Error fetching country:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const totalPages = Math.ceil(countries.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = countries.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Single delete
  const deleteCountry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this country?')) return
    try {
      await fetch(`http://127.0.0.1:8000/country/countries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setCountries((prev) => prev.filter((newData) => newData.id !== id))
    } catch (error) {
      console.error('Delete failed:', error.message)
      alert('Failed to delete. Authentication error.')
    }
  }

  // Bulk delete
  const deleteSelected = async () => {
    if (!window.confirm('Delete selected items?')) return
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://127.0.0.1:8000/country/countriesMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setCountries((prev) => prev.filter((newData) => !selectedIds.includes(newData.id)))
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Bulk delete failed:', error.message)
      alert('Bulk delete failed. Authentication error.')
    }
  }

  // Delete all
  const deleteAll = async () => {
    if (!window.confirm('Delete all items?')) return
    try {
      await fetch('http://127.0.0.1:8000/country/countriesAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setCountries([])
      setSelectedIds([])
      setSelectAll(false)
    } catch (error) {
      console.error('Delete all failed:', error.message)
      alert('Failed to delete all. Authentication error.')
    }
  }

  // Select checkboxes
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      const currentPageIds = currentItems.map((item) => item.id)
      setSelectedIds(currentPageIds)
    }
    setSelectAll(!selectAll)
  }

  return (
    <>
      <div className="category-box">
        <Link to="/countries">
          <span className="add-btn"> New Country</span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Country Name , UID ,ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <h2>Countries List</h2>
        </div>

        <div className="bulk-actions">
          <button onClick={deleteSelected} disabled={selectedIds.length === 0}>
            Delete Selected
          </button>
          <button onClick={deleteAll}>Delete All</button>
        </div>

        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>UID</th>
                <th>Country Name</th>
                <th>Country Code</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, i) => (
                <tr key={p.id || i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => handleSelect(p.id)}
                    />
                  </td>
                  <td>{p.uid || `#${p.id}`}</td>
                  <td>{p.countryName}</td>
                  <td>{p.countryCode}</td>
                  <td>{p.status}</td>
                  <td className="actions">
                    <button className="view">👁</button>
                    <button className="edit">✏</button>
                    <button className="delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, countries.length)} of {countries.length}
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

export default CountriesList
