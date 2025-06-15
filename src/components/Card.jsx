import React from 'react'

const Card = ({icon,title,value}) => {
  return (
    //bg-sky-100
    <div className="flex items-center gap-5 p-6 bg-white rounded-2xl shadow-xl border border-sky-200 transition-transform duration-300 hover:scale-105 w-full max-w-sm">
  <div className="p-3 rounded-full bg-sky-100 text-sky-600 text-xl">
    {icon}
  </div>
  <div>
  <h2 className="text-gray-700 font-semibold text-sm">{title}</h2>
  <h2
    className={`text-xl font-bold ${
      title === "Total Present %"
        ? "text-green-600"
        : title === "Total Absent %"
        ? "text-red-600"
        : "text-sky-700"
    }`}
  >
    {value}
  </h2>
</div>
</div>

  )
}

export default Card