import AppHeader from '@/app/_components/AppHeader'
import React from 'react'

function CropAnalysisLayout({children}:{children:React.ReactNode}) {
  return (
    <>
     <div className="flex flex-col w-full">
      {/* <AppHeader> */}
        {/* <h1 className="text-xl font-semibold ml-2">Dashboard</h1> */}
      {/* </AppHeader> */}
      <main className="p-4">{children}</main>
    </div>
    </>
  )
}

export default CropAnalysisLayout