import React, {useEffect, useState} from "react";
import axios from "axios"

const FileSelector = ({onSelect}) => {
    const [files, setFiles] = useState([])
    useEffect(()=>{
        const fetchFiles = async() => {
            try{
                const res = await axios.get('/api/list-files')
                setFiles(res.data.files || [])
            }catch (err) {
                console.error('Error fetching files:', err)
            }
        }

        fetchFiles()
    }, [])
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Select a file</h2>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      >
        <option value="">-- Select a file --</option>
        {files.map((file, idx) => (
          <option key={idx} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FileSelector