import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ClubsList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const ClubsList = () => {
  const [clubs, setClubs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [types, setVehicleTypes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch vehicle types
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/category/categoriesAll', {
          headers: getAuthHeaders(),
        })
        setVehicleTypes(response.data)
      } catch (err) {
        console.error('Error fetching vehicle types:', err)
      }
    }
    fetchVehicleTypes()
  }, [])

  // Fetch all clubs
  const fetchClubs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/club/clubsAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch clubs: Not authenticated')
      }
      const data = await response.json()
      setClubs(data)
    } catch (error) {
      console.error('Error fetching clubs:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  const totalPages = Math.ceil(clubs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = clubs.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Single delete
  const deleteClub = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return
    try {
      await fetch(`http://127.0.0.1:8000/club/clubs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setClubs((prev) => prev.filter((club) => club.id !== id))
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
          fetch(`http://127.0.0.1:8000/club/clubsMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setClubs((prev) => prev.filter((club) => !selectedIds.includes(club.id)))
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
      await fetch('http://127.0.0.1:8000/club/clubsAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setClubs([])
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

  const getVehicleType = (typeId) => {
    const type = types.find((t) => t.id === typeId)
    return type ? type.type : 'Unknown'
  }

  return (
    <>
      <div className="category-box">
        <Link to="/clubs">
          <span className="add-btn">New Club</span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Club Name, UID, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <h2>Clubs List</h2>
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
                <th>Club Name</th>
                <th>Store Number</th>
                <th>Vehicle Number</th>
                <th>Vehicle Type</th>
                <th>Cron Job Date</th>
                <th>Cron Job Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((club) => (
                <tr key={club.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(club.id)}
                      onChange={() => handleSelect(club.id)}
                    />
                  </td>
                  <td>{club.uid || `#${club.id}`}</td>
                  <td>{club.clubName}</td>
                  <td>{club.storeNumber}</td>
                  <td>{club.vehicleNumber}</td>
                  <td>{getVehicleType(club.vehicleType)}</td>
                  <td>{club.cronJobDate}</td>
                  <td style={{ color: club.cronJobStatus === 1 ? 'green' : 'red' }}>
                    {club.cronJobStatus === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/clubs/view/${club.id}`)}>
                      👁
                    </button>
                    <button className="edit" onClick={() => navigate(`/editClubs/${club.id}`)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deleteClub(club.id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, clubs.length)} of {clubs.length}
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

export default ClubsList
