import React, { useState } from "react";
import * as XLSX from "xlsx";

const Excel = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // Handle file upload and parse Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setData(jsonData);
      };

      reader.readAsBinaryString(file);
    }
  };

  // Handle checkbox changes for row selection
  const handleCheckboxChange = (rowIndex) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  // Save selected rows to localStorage (mock database)
  const handleSaveToDB = () => {
    const selectedData = data.filter((_, index) => selectedRows[index]);
    if (selectedData.length > 0) {
      localStorage.setItem("savedData", JSON.stringify(selectedData));
      alert("Rows saved to localStorage!");
    } else {
      alert("No rows selected!");
    }
  };

  // Download selected rows as a JSON file
  const handleDownloadJSON = () => {
    const selectedData = data.filter((_, index) => selectedRows[index]);
    if (selectedData.length > 0) {
      const blob = new Blob([JSON.stringify(selectedData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "selected-rows.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("No rows selected to download!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        تبدیل محتویات فایل اکسل به JSON و ذخیره در پایگاه داده
      </h1>
      <p className="mb-4 text-gray-700">
        فایل اکسل خود را انتخاب کنید، ردیف‌های موردنظر را برای ذخیره یا دانلود JSON انتخاب کنید.
      </p>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="block w-64 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-4 overflow-auto">
        {data.length > 0 ? (
          <>
            <table className="w-full border-collapse text-sm text-right">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 px-4 py-2">انتخاب</th>
                  {Object.keys(data[0]).map((key, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-blue-700"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!selectedRows[rowIndex]}
                        onChange={() => handleCheckboxChange(rowIndex)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                    </td>
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleSaveToDB}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
              >
                ذخیره در پایگاه داده
              </button>
              <button
                onClick={handleDownloadJSON}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                دانلود JSON
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">فایل انتخاب نشده است.</p>
        )}
      </div>
    </div>
  );
};

export default Excel;
