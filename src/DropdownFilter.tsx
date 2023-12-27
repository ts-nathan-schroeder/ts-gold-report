import { useEffect, useState } from "react"
interface DropdownFilterProps {
    tsURL: string,
    field: string,
    fieldLabel: string,
    value: any[],
    runtimeFilters: {},
    setFilter: (value: any)=>void
    multiple: boolean,
    height:string
}
export const DropdownFilter: React.FC<DropdownFilterProps> = ({tsURL,field,fieldLabel,runtimeFilters,setFilter,multiple,height}: DropdownFilterProps) => {
    const [options, setOptions] = useState<any[]>([])
    useEffect(()=>{
        var url = tsURL+"api/rest/2.0/searchdata"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
            body: JSON.stringify({
                "logical_table_identifier": "5038aaef-031a-4c4e-a442-84b5ade2a218",
                "query_string":"["+field+"] sort by ["+field+"] ["+field+"] != '-1 N/A'", //Add sort by
                "data_format": "COMPACT",
                "record_offset": 0,
                "runtime_filter":runtimeFilters,
                "record_size": 50,
            })
        }).then(response => response.json()).then(data => {
            let filterData = data.contents[0].data_rows;
            var optionsCopy: any[] = []
            for (var dataRow of filterData){
                optionsCopy.push(dataRow[0]);
            }
            setOptions(optionsCopy)
        })
    },[])
    return (
        <select className={height} style={{width:"100%"}} onChange={(e) => {
            console.log(e.target.selectedOptions);
            if (multiple){
                let filterVals = Array.from(e.target.selectedOptions).map((option) => {return option.value})
                if (filterVals.includes("ALL")){
                    setFilter([])
                }else{
                    setFilter(filterVals)
                }
            }else{
                if (e.target.value == 'ALL'){
                    setFilter([])
                }else{
                    setFilter([e.target.value])
                }
            }
            }} multiple={multiple}>
            <option selected={true} value={"ALL"}>ALL {fieldLabel}</option>
            {options.map((option)=>{
                return <option value={option}>{option}</option>
            })}
        </select>
    )
}