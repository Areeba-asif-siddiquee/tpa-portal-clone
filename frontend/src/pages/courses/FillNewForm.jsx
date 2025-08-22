import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

const FillNewForm = () => {
  const [form, setForm] = useState({
    department: '',
    area: '',
    domain: '',
    remark: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post('/requests', form)
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to submit form', error)
      alert('Failed to submit form, please try again.')
    }
  }

  return (
     <form
      className="max-w-lg mx-auto bg-white border-4 border-blue-200 rounded-2xl p-10 flex flex-col gap-10 shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold text-center mb-2">
        REQUEST FOR A TRAINING SESSION
      </h2>
      <p className="text-gray-700 text-left text-sm mb-2">
        A Training form for the authentic users of Indraprastha Gas Limited.
      </p>
      <div>
        <label className="block font-medium mb-1">Department of Interest</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400"
        >
          <option value="">Enter your New Department</option>
          <option value="deptA">Department A</option>
          <option value="deptB">Department B</option>
          <option value="deptC">Department C</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Area of Interest</label>
        <select
          name="area"
          value={form.area}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400"
        >
          <option value="">Enter your Area of Interest</option>
          <option value="areaA">Area A</option>
          <option value="areaB">Area B</option>
          <option value="areaC">Area C</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Training Domain</label>
        <select
          name="domain"
          value={form.domain}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400"
        >
          <option value="">Enter your Training Domain</option>
          <option value="domainA">Domain A</option>
          <option value="domainB">Domain B</option>
          <option value="domainC">Domain C</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Remark</label>
        <textarea
          name="remark"
          rows={2}
          placeholder="Enter here.."
          value={form.remark}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400"
        />
      </div>
      <button
        type="submit"
        className="w-auto mt-1 rounded-lg bg-blue-200 text-gray-700 font-medium py-1 transition hover:bg-gray-300"
      >
        Submit
      </button>
    </form>

  )
}

export default FillNewForm;
