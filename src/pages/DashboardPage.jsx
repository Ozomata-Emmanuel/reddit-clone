import React from 'react'
import DashboardSideBar from '../components/DashboardSideBar'
import DashboardHearder from '../components/DashboardHearder'
import { Outlet } from 'react-router-dom'

const DashboardPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200">
      <DashboardSideBar className="pr-10" />
      <div className="lg:pl-72">
        <DashboardHearder />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </>
  )
}

export default DashboardPage
