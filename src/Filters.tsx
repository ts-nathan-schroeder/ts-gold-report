import { useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";

interface FilterProps{
    tsURL: string
}
export const Filters: React.FC<FilterProps> = ({tsURL}:FilterProps) => {
    const [timeFrame,setTimeFrame] = useState([])
    const [division, setDivision] = useState([])
    const [district, setDistrict] = useState([])
    const [category, setCategory] = useState([])
    const [store, setStore] = useState([])
    const [group, setGroup] = useState([])
    const [upc, setUpc] = useState([])
    
    function onReportLoad(){
        let runtimeFilters = []
        if (category.length > 0 || category[0]=='ALL') {
            runtimeFilters.push( {
                columnName: "Category Description",
                operator: RuntimeFilterOp.IN,
                values: category
            })
        }
        if (group.length > 0 || group[0]=='ALL'){
            runtimeFilters.push({
                columnName: "Group Description",
                operator: RuntimeFilterOp.IN,
                values: group
            })
        }
        if (upc.length > 0 || upc[0]=='ALL'){
            runtimeFilters.push({
                columnName: "Internet Item Description",
                operator: RuntimeFilterOp.IN,
                values: upc
            })
        }
        if (store.length > 0 || store[0]=='ALL'){
            runtimeFilters.push({
                columnName: "Store ID",
                operator: RuntimeFilterOp.IN,
                values: store
            })
        }
        if (district.length > 0 || district[0]=='ALL'){
            runtimeFilters.push({
                columnName: "District Name",
                operator: RuntimeFilterOp.IN,
                values: district
            })
        }
        if (division.length > 0 || division[0]=='ALL'){
            runtimeFilters.push({
                columnName: "Division Name",
                operator: RuntimeFilterOp.IN,
                values: division
            })
        }
        if (timeFrame.length > 0){
            runtimeFilters.push({
                columnName: "Week ID",
                operator: RuntimeFilterOp.IN,
                values: timeFrame
            })
        }
     
        const event = new CustomEvent('loadReport', {detail: {data: runtimeFilters}});
        window.dispatchEvent(event)
    }


    return (
        <div className="flex flex-row w-full bg-slate-600 p-4 space-x-4" style={{height:'530px'}}>
            <div className="flex flex-col w-1/3 h-full space-y-4">
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        1. TIME FRAME
                    </div>
                    <div className="bg-slate-100 rounded-lg p-4 text-lg">
                    <div className="font-bold">Promo Week</div>
                    <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={timeFrame} field={"Week ID"} setFilter={setTimeFrame} multiple={false}  height={"h-8"}></DropdownFilter>

                    </div>
                </div>
                
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        2. LOCATION
                    </div>
                    <div className="flex flex-col bg-slate-100 rounded-lg p-4 space-y-4">
                    <div className="flex flex-col text-lg">
                    <div className="font-bold">Choose Division</div>
                    <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={division} field={"Division Name"} setFilter={setDivision} multiple={true}  height={"h-28"}></DropdownFilter>
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="font-bold">Choose District</div>
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"Division Name",
                        op1:"IN",
                        val1:division
                    }} value={district} field={"District Name"} setFilter={setDistrict} multiple={false}  height={"h-8"}></DropdownFilter>
                   </div>
                    <div className="flex flex-col text-lg">
                    <div className="font-bold">Choose Store</div>
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"District Name",
                        op1:"IN",
                        val1:district,
                        col2:"Division Name",
                        op2:"IN",
                        val2:division
                    }} value={store} field={"Store ID"} setFilter={setStore} multiple={false}  height={"h-8"}></DropdownFilter>
                    </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full h-full">
            <   div className="text-white text-2xl font-bold">
                3. PRODUCT HIERARCHY
                </div>
                <div className="flex flex-row w-full h-full bg-slate-100 rounded-lg p-4 space-x-4">
                    <div className="flex flex-col h-full w-1/2 text-lg">
                        <div className="mb-8">
                            <div className="font-bold">Group Hierarchy</div>
                            <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={group} field={"Group Description"} setFilter={setGroup} multiple={true} height={"h-40"}></DropdownFilter>
                        </div>
                        <div className="mb-4">
                            <div className="font-bold">Category Hierarchy</div>
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                            }} value={category} field={"Category Description"} setFilter={setCategory} multiple={true} height={"h-40"}></DropdownFilter>
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-1/2 text-lg">
                        <div className="mb-8">
                            <div className="font-bold">UPC Hierarchy</div>
                            <DropdownFilter key={group[0]+category[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                                col2:"Category Description",
                                op2:"IN",
                                val2:category
                            }} value={upc} field={"Internet Item Description"} setFilter={setUpc} multiple={true} height={"h-72"}></DropdownFilter>
                        </div>
                        <div onClick={onReportLoad} className="flex bg-slate-600 hover:bg-slate-500 align-center items-center p-4 text-white font-bold hover:cursor-pointer rounded-lg">
                            Load Report
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}