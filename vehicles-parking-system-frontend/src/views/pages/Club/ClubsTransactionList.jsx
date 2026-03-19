import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ClubsList.css'
import { CIcon } from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ITEMS_PER_PAGE = 10

const ClubsTransactionList = () => {
  const [clubTransaction, setClubTransaction] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [clubNames, setClubNames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch all clubs transactions
  const fetchClubTransaction = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/club/clubTransactionAll', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch club transactions')
      const data = await response.json()
      setClubTransaction(data)
    } catch (error) {
      console.error('Error fetching clubs:', error.message)
      alert('Authentication required. Please log in again.')
    }
  }

  useEffect(() => {
    fetchClubTransaction()
  }, [])

  const totalPages = Math.ceil(clubTransaction.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = clubTransaction.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Single delete
  const deleteClubTransactions = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club transaction?')) return
    try {
      await fetch(`http://127.0.0.1:8000/club/clubTransaction/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setClubTransaction((prev) => prev.filter((item) => item.id !== id))
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
          fetch(`http://127.0.0.1:8000/club/clubTransactionMultiple/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          }),
        ),
      )
      setClubTransaction((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
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
      await fetch('http://127.0.0.1:8000/club/clubTransAll', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      setClubTransaction([])
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

  // Fetch club names
  useEffect(() => {
    const fetchClubNames = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/club/clubsAll', {
          headers: getAuthHeaders(),
        })
        setClubNames(response.data)
      } catch (err) {
        console.error('Error fetching club names:', err)
      }
    }
    fetchClubNames()
  }, [])

  const getClubName = (clubId) => {
    const club = clubNames.find((c) => c.id === clubId)
    return club ? club.clubName : 'Unknown'
  }

  return (
    <>
      <div className="category-box">
        <Link to="/clubtransaction">
          <span className="add-btn">New Club Transaction</span>
        </Link>
      </div>
      <div className="filter-box">
        <div className="filter-input-wrapper">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Club Transaction Name, UID, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
      <div className="list-container">
        <div className="list-heading">
          <h2>Club Transaction List</h2>
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
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Grace Period</th>
                <th>Cron Job Date</th>
                <th>Cron Job Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tx.id)}
                      onChange={() => handleSelect(tx.id)}
                    />
                  </td>
                  <td>{tx.uid || `#${tx.id}`}</td>
                  <td>{getClubName(tx.club_id)}</td>
                  <td>{tx.transaction_id}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.gracePeriod}</td>
                  <td>{tx.cronJobDate}</td>
                  <td style={{ color: tx.cronJobStatus === 1 ? 'green' : 'red' }}>
                    {tx.cronJobStatus === 1 ? 'Enable' : 'Disable'}
                  </td>
                  <td className="actions">
                    <button className="view" onClick={() => navigate(`/clubs/view/${tx.id}`)}>
                      👁
                    </button>
                    <button
                      className="edit"
                      onClick={() => navigate(`/editClubtransaction/${tx.id}`)}
                    >
                      ✏️
                    </button>
                    <button className="delete" onClick={() => deleteClubTransactions(tx.id)}>
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
            Showing {startIndex + 1}-{Math.min(endIndex, clubTransaction.length)} of{' '}
            {clubTransaction.length}
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

export default ClubsTransactionList
