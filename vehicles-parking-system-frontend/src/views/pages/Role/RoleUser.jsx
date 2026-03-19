import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RoleUser.css'
import { Link } from 'react-router-dom'

const RoleUser = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ role: '', user: '' })
  const [roleUsers, setRoleUsers] = useState([
    { id: 1, role: 'Admin', user: 'User A' },
    { id: 2, role: 'Manager', user: 'User B' },
  ])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = roleUsers.slice(startIndex, endIndex)
  const totalPages = Math.ceil(roleUsers.length / itemsPerPage)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', form)
    // You would normally post this to an API
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(currentItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const deleteSelected = () => {
    setRoleUsers((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
    setSelectedIds([])
    setSelectAll(false)
  }

  const deleteRoleUser = (id) => {
    setRoleUsers((prev) => prev.filter((item) => item.id !== id))
  }

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="role-user-container">
      <h2 className="title">Role User</h2>
      <form className="role-user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Role name</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label>User name</label>
            <select name="user" value={form.user} onChange={handleChange}>
              <option value="">Select User</option>
              <option value="User A">User A</option>
              <option value="User B">User B</option>
            </select>
          </div>
        </div>
        <div className="btn">
          <div className="save-button">
            <button type="submit">Save</button>
          </div>
          <div className="cancel-button">
            <button type="button" onClick={() => navigate('/RoleUserList')}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RoleUser
