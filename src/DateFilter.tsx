import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { HiCalendar } from "react-icons/hi";

interface DateFilterProps {
    value: any,
    onChange: (val: any)=>void,
    clearDateRange: () => void
}
const DateRangeFilter: React.FC<DateFilterProps> = ({value, onChange, clearDateRange}: DateFilterProps) => {
    const [datePickerVisible, setDatePickerVisible]= useState(false);
    function toggleClear(){
        setDatePickerVisible(false);
        clearDateRange()
    }
    function toggleSubmit(){
        setDatePickerVisible(false)
        onChange(value);
    }
    return (
        <div className="flex align-center">
            <HiCalendar className="text-2xl hover:cursor-pointer hover:text-blue-500" onClick={()=>setDatePickerVisible(!datePickerVisible)}></HiCalendar>
         {datePickerVisible && (
            <div className="absolute w-96 p-8 bg-white shadow-2xl rounded-lg ml-8">
              <DateRangePicker
              staticRanges={[]}
              inputRanges={[]}
              ranges={[value ? value : {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: 'selection',
                }]}
              onChange={(data)=>onChange(data.selection)}
            />      
            <div className="flex flex-row space-x-4">
                <div onClick={()=>toggleSubmit} className="bg-yellow-400 flex justify-center items-center w-24 h-12 rounded-lg text-white ">
                    Submit
                </div>
                <div onClick={toggleClear} className="bg-gray-400 flex justify-center items-center w-24 h-12 rounded-lg text-white ">
                    Clear
                </div>
            </div>
            </div>
         )}
        </div>

    )
}
export default DateRangeFilter