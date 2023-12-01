import { useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
  import { HiBan } from "react-icons/hi";

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

    const [groupSelected, setGroupSelected] = useState(false);
    const [storeSelected, setStoreSelected] = useState(false);
    const [categorySelected, setCategorySelected] = useState(false);
    const [districtSelected, setDistrictSelected] = useState(false);
    const [divisionSelected, setDivisionSelected] = useState(false);
    const [upcSelected, setUpcSelected] = useState(false);


    
    function onReportLoad(){
        let searchString = "";
        if ((category.length > 0 || category[0]=='ALL') && !categorySelected && !groupSelected)  {
            for (var value of category){
                searchString+=" [Category Description]."+"'"+value+"'"
            }
        }
        if ((group.length > 0 || group[0]=='ALL') && !groupSelected)  {
            for (var value of group){
                searchString+=" [Group Description]."+"'"+value+"'"
            }
        }
        if ((upc.length > 0 || upc[0]=='ALL') && !upcSelected && !groupSelected && !categorySelected)  {
            for (var value of upc){
                searchString+=" [Internet Item Description]."+"'"+value+"'"
            }
        }
        if ((store.length > 0 || store[0]=='ALL') && !divisionSelected)  {
            for (var value of store){
                searchString+=" [Store ID]."+"'"+value+"'"
            }
        }
        if ((district.length > 0 || district[0]=='ALL') && !districtSelected)  {
            for (var value of district){
                searchString+=" [District Name]."+"'"+value+"'"
            }
        }
        if ((division.length > 0 || division[0]=='ALL') && !divisionSelected) {
            for (var value of division){
                searchString+=" [Division Name]."+"'"+value+"'"
            }
        }
        if (timeFrame.length > 0 || timeFrame[0]=='ALL') {
            for (var value of timeFrame){
                searchString+=" [Week ID]."+"'"+value+"'"
            }
        }
        let selectedFields: string[] = [];
        if (groupSelected) selectedFields.push('Group Description')
        if (categorySelected) selectedFields.push('Category Description')
        if (upcSelected) selectedFields.push('Internet Item Description')
        if (storeSelected) selectedFields.push('Store ID')
        if (districtSelected) selectedFields.push('District Name')
        if (divisionSelected) selectedFields.push('Division Name')
        console.log(selectedFields,"asdf");
        const event = new CustomEvent('loadReport', {detail: {data: {
            selectedFields: selectedFields,
            searchString: searchString}
        }});
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
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-3/4">
                            Choose Division
                            <div className="ml-2 text-blue-400 hover:cursor-pointer hover:font-bold">All</div>
                        </div>
                        <div className="flex justify-end w-1/4">
                            <input onChange={()=>setDivisionSelected(!divisionSelected)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionSelected ?
                    <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={division} field={"Division Name"} setFilter={setDivision} multiple={true}  height={"h-28"}></DropdownFilter>
                    :
                    <div className="h-28 w-full bg-white flex items-center justify-center">
                    {divisionSelected ? 'Rollup' : 'Not Included'}
                    </div>
                    }
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-3/4">Choose District
                        <div className="ml-2 text-blue-400 hover:cursor-pointer hover:font-bold">All</div>
                        </div>
                        <div className="flex justify-end w-3/4">
                            <input onChange={()=>setDistrictSelected(!districtSelected)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionSelected && !districtSelected ?
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"Division Name",
                        op1:"IN",
                        val1:division
                    }} value={district} field={"District Name"} setFilter={setDistrict} multiple={false}  height={"h-8"}></DropdownFilter>
                    :
                    <div className="h-8 w-full bg-white flex items-center justify-center">
                    {districtSelected ? 'Rollup' : 'Not Included'}
                    </div>
                    }
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-1/2">Choose Store</div>
                        <div className="flex justify-end w-1/2">
                            <input onChange={()=>setStoreSelected(!storeSelected)} type="checkbox"></input>
                        </div>
                    </div>
                    {!storeSelected && !divisionSelected && !districtSelected ?
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"District Name",
                        op1:"IN",
                        val1:district,
                        col2:"Division Name",
                        op2:"IN",
                        val2:division
                    }} value={store} field={"Store ID"} setFilter={setStore} multiple={false}  height={"h-8"}></DropdownFilter>
                    :
                    <div className="h-8 w-full bg-white flex items-center justify-center">
                    {storeSelected ? 'Rollup' : 'Not Included'}
                    </div>
                    }
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
                            <div className="flex flex-row font-bold w-full">
                                <div className="flex justify-start w-1/2">Group Hierarchy</div>
                                <div className="flex justify-end w-1/2">
                                    <input onChange={()=>setGroupSelected(!groupSelected)} type="checkbox"></input>
                                </div>
                            </div>
                            {!groupSelected ?
                            <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={group} field={"Group Description"} setFilter={setGroup} multiple={true} height={"h-40"}></DropdownFilter>
                            :
                            <div className="h-40 w-full bg-white flex items-center justify-center">
                            {groupSelected ? 'Rollup' : 'Not Included'}
                            </div>
                            }
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row font-bold w-full">
                                    <div className="flex justify-start w-1/2">Category Hierarchy</div>
                                    <div className="flex justify-end w-1/2">
                                        <input onChange={()=>setCategorySelected(!categorySelected)} type="checkbox"></input>
                                    </div>
                            </div>
                            {!groupSelected && !categorySelected?
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                            }} value={category} field={"Category Description"} setFilter={setCategory} multiple={true} height={"h-40"}></DropdownFilter>
                            :
                            <div className="h-40 w-full bg-white flex items-center justify-center">
                            {categorySelected ? 'Rollup' : 'Not Included'}
                            </div>
                            }
                            </div>
                    </div>
                    <div className="flex flex-col h-full w-1/2 text-lg">
                        <div className="mb-8">
                            <div className="flex flex-row font-bold w-full">
                                <div className="flex justify-start w-1/2">UPC Hierarchy</div>
                                <div className="flex justify-end w-1/2">
                                    <input onChange={()=>setUpcSelected(!upcSelected)} type="checkbox"></input>
                                </div>
                            </div>
                            {!groupSelected && !categorySelected && !upcSelected ?
                            <DropdownFilter key={group[0]+category[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                                col2:"Category Description",
                                op2:"IN",
                                val2:category
                            }} value={upc} field={"Internet Item Description"} setFilter={setUpc} multiple={true} height={"h-72"}></DropdownFilter>
                            :
                            <div className="h-72 w-full bg-white flex items-center justify-center">
                            {upcSelected ? 'Rollup' : 'Not Included'}
                            </div>
                            }
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