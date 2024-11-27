import React from 'react'

const SemSelection = ({selectedSem}) => {
  return (
    <div>
        <div >
            <select className='p-2 border rounded-lg'
            onChange={(e)=>selectedSem(e.target.value)
            }>
                <option value={"5th"}>
                    5
                </option>
                <option value={"6th"}>
                    6
                </option>
                <option value={"7th"}>
                    7
                </option>
            </select>
        </div>
    </div>
  )
}

export default SemSelection