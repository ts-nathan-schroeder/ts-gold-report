import { useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
  import { HiBan, HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import {FieldName, FieldLabel} from "./DataDefinitions"
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

    const [groupRollup, setGroupRollup] = useState(false);
    const [storeRollup, setStoreRoleup] = useState(false);
    const [categoryRollup, setCategoryRollup] = useState(false);
    const [districtRollup, setDistrictRollup] = useState(false);
    const [divisionRollup, setDivisionRollup] = useState(false);
    const [upcRollup, setUpcRollup] = useState(false);

    const [groupExclude,setGroupExclude] = useState(false);
    const [storeExclude,setStoreExclude] = useState(false);
    const [categoryExclude,setCategoryExclude] = useState(false);
    const [districtExclude,setDistrictExclude] = useState(false);
    const [divisionExclude,setDivisionExclude] = useState(false);
    const [upcExclude,setUpcExclude] = useState(false);

    const [selectedFields, setSelectedFields] = useState<string[]>([])

    function toggleField(field: string){
        let selectedFieldsCopy = selectedFields;
        if (selectedFieldsCopy.includes(field)){
            selectedFieldsCopy = selectedFieldsCopy.filter((value) => value !== field);
        }else{
            selectedFieldsCopy.push(field);
        }
        setSelectedFields(selectedFieldsCopy);
    }
    
    function onReportLoad(){
        let searchString = "";
        //Add fields
        let selectedFieldsCopy: string[] = selectedFields;
        if (groupRollup) selectedFieldsCopy.push(FieldName.GROUP)
        if (categoryRollup) selectedFieldsCopy.push(FieldName.CATEGORY)
        if (upcRollup) selectedFieldsCopy.push(FieldName.UPC)
        if (storeRollup) selectedFieldsCopy.push(FieldName.STORE)
        if (districtRollup) selectedFieldsCopy.push(FieldName.DISTRICT)
        if (divisionRollup) selectedFieldsCopy.push(FieldName.DIVISION)
        for (var field of selectedFieldsCopy){
            searchString+="["+field+"] "
        }
        //Add filters
        if ((category.length > 0 || category[0]=='ALL') && !categoryRollup && !groupRollup)  {
            if (categoryExclude) searchString+= " ["+FieldName.CATEGORY+"] !="
            for (var value of category){
                searchString+=" ["+FieldName.CATEGORY +"]."+"'"+value+"'"
            }
        }
        if ((group.length > 0 || group[0]=='ALL') && !groupRollup)  {
            if (groupExclude) searchString+= " ["+FieldName.GROUP+ "] !="
            for (var value of group){
                searchString+=" ["+FieldName.GROUP+"]."+"'"+value+"'"
            }
        }
        if ((upc.length > 0 || upc[0]=='ALL') && !upcRollup && !groupRollup && !categoryRollup)  {
            if (upcExclude) searchString+= " ["+FieldName.UPC+"] !="
            for (var value of upc){
                searchString+=" ["+FieldName.UPC+"]."+"'"+value+"'"
            }
        }
        if ((store.length > 0 || store[0]=='ALL') && !divisionRollup)  {
            if (storeExclude) searchString+= " ["+FieldName.STORE +"] !="
            for (var value of store){
                searchString+=" ["+FieldName.STORE+"]."+"'"+value+"'"
            }
        }
        if ((district.length > 0 || district[0]=='ALL') && !districtRollup)  {
            if (districtExclude) searchString+= " ["+FieldName.DISTRICT+"] !="
            for (var value of district){
                searchString+=" ["+FieldName.DISTRICT+"]."+"'"+value+"'"
            }
        }
        if ((division.length > 0 || division[0]=='ALL') && !divisionRollup) {
            if (divisionExclude) searchString+=" ["+FieldName.DIVISION+"] !="
            for (var value of division){
                searchString+=" ["+FieldName.DIVISION+"]."+"'"+value+"'"
            }
        }
        if (timeFrame.length > 0 || timeFrame[0]=='ALL') {
            for (var value of timeFrame){
                searchString+=" [Week ID]."+"'"+value+"'"
            }
        }
        
        const event = new CustomEvent('loadReport', {detail: {data: {
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
                        <select>
                            <option>Yesterday</option>
                            <option>Today</option>
                            <option>This Week</option>
                        </select>
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
                            <IncludeExcludeButton value={divisionExclude}  setValue={setDivisionExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-1/4">
                            <div className="mr-2 font-normal">Rollup</div>
                            <input onChange={()=>setDivisionRollup(!divisionRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionRollup ?
                    <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={division} field={FieldName.DIVISION} fieldLabel={FieldLabel.DIVISION} setFilter={setDivision} multiple={true}  height={"h-28"}></DropdownFilter>
                    :
                    <div className="h-28 w-full bg-white flex items-center justify-center">
                    {divisionRollup ? 'Rollup' : 'Not Included'}
                    </div>
                    }
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-3/4">Choose District
                        <IncludeExcludeButton value={districtExclude}  setValue={setDistrictExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-3/4">
                            <div className="mr-2 font-normal">Rollup</div>
                            <input onChange={()=>setDistrictRollup(!districtRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionRollup && !districtRollup ?
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"Division Name",
                        op1:"IN",
                        val1:division
                    }} value={district} field={FieldName.DISTRICT} fieldLabel={FieldLabel.DISTRICT} setFilter={setDistrict} multiple={false}  height={"h-8"}></DropdownFilter>
                    :
                    <div className="h-8 w-full bg-white flex items-center justify-center">
                    {districtRollup ? 'Rollup' : 'Not Included'}
                    </div>
                    }
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-1/2">Choose Store
                        <IncludeExcludeButton value={storeExclude}  setValue={setStoreExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-1/2">
                            <div className="mr-2 font-normal">Rollup</div>
                            <input onChange={()=>setStoreRoleup(!storeRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!storeRollup && !divisionRollup && !districtRollup ?
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"District Name",
                        op1:"IN",
                        val1:district,
                        col2:"Division Name",
                        op2:"IN",
                        val2:division
                    }} value={store} field={FieldName.STORE} fieldLabel={FieldLabel.STORE} setFilter={setStore} multiple={false}  height={"h-8"}></DropdownFilter>
                    :
                    <div className="h-8 w-full bg-white flex items-center justify-center">
                    {storeRollup ? 'Rollup' : 'Not Included'}
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
                    <div className="flex flex-col h-full w-5/12 text-lg">
                        <div className="mb-8">
                            <div className="flex flex-row font-bold w-full">
                                <div className="flex justify-start w-1/2">Group Hierarchy
                                <IncludeExcludeButton value={groupExclude}  setValue={setGroupExclude}></IncludeExcludeButton>
                                </div>
                                <div className="flex justify-end w-1/2">
                                    <div className="mr-2 font-normal">Rollup</div>
                                    <input onChange={()=>setGroupRollup(!groupRollup)} type="checkbox"></input>
                                </div>
                            </div>
                            {!groupRollup ?
                            <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={group} fieldLabel={FieldLabel.GROUP} field={FieldName.GROUP} setFilter={setGroup} multiple={true} height={"h-40"}></DropdownFilter>
                            :
                            <div className="h-40 w-full bg-white flex items-center justify-center">
                            {groupRollup ? 'Rollup' : 'Not Included'}
                            </div>
                            }
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row font-bold w-full">
                                    <div className="flex justify-start w-1/2">Category Hierarchy
                                    <IncludeExcludeButton value={categoryExclude}  setValue={setCategoryExclude}></IncludeExcludeButton>
                                    </div>
                                    <div className="flex justify-end w-1/2">
                                        <div className="mr-2 font-normal">Rollup</div>
                                        <input onChange={()=>setCategoryRollup(!categoryRollup)} type="checkbox"></input>
                                    </div>
                            </div>
                            {!groupRollup && !categoryRollup?
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                            }} value={category} field={FieldName.CATEGORY} fieldLabel={FieldLabel.CATEGORY} setFilter={setCategory} multiple={true} height={"h-40"}></DropdownFilter>
                            :
                            <div className="h-40 w-full bg-white flex items-center justify-center">
                            {categoryRollup ? 'Rollup' : 'Not Included'}
                            </div>
                            }
                            </div>
                    </div>
                    <div className="flex flex-col h-full w-5/12 text-lg">
                        <div className="mb-8">
                            <div className="flex flex-row font-bold w-full">
                                <div className="flex justify-start w-1/2">UPC Hierarchy
                                <IncludeExcludeButton value={upcExclude}  setValue={setUpcExclude}></IncludeExcludeButton>
                                </div>
                                <div className="flex justify-end w-1/2">
                                    <div className="mr-2 font-normal">Rollup</div>
                                    <input onChange={()=>setUpcRollup(!upcRollup)} type="checkbox"></input>
                                </div>
                            </div>
                            {!groupRollup && !categoryRollup && !upcRollup ?
                            <DropdownFilter key={group[0]+category[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:"IN",
                                val1:group,
                                col2:"Category Description",
                                op2:"IN",
                                val2:category
                            }} value={upc} field={FieldName.UPC} fieldLabel={FieldLabel.UPC} setFilter={setUpc} multiple={true} height={"h-72"}></DropdownFilter>
                            :
                            <div className="h-72 w-full bg-white flex items-center justify-center">
                            {upcRollup ? 'Rollup' : 'Not Included'}
                            </div>
                            }
                            </div>
                        <div onClick={onReportLoad} className="flex bg-slate-600 hover:bg-slate-500 align-center items-center p-4 text-white font-bold hover:cursor-pointer rounded-lg">
                            Load Report
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-2/12 text-lg justify-center">
                        <div className="font-bold">Additional Fields</div>
                        <div><input className="mr-2" onChange={()=>toggleField("Banner Store")} type="checkbox"></input>Banner</div>
                        <div><input className="mr-2" onChange={()=>toggleField("Vendor Brand")} type="checkbox"></input>Vendor</div>
                        <div><input className="mr-2" onChange={()=>toggleField("Class")} type="checkbox"></input>Class</div>
                        <div><input className="mr-2" onChange={()=>toggleField("Sub Class")} type="checkbox"></input>Sub Class</div>
                    </div>
                </div>

            </div>
        </div>

    )
}
interface IncludeExcludeButtonProps {
    value: boolean,
    setValue: (val: boolean)=> void;
}
const IncludeExcludeButton: React.FC<IncludeExcludeButtonProps> = ({value, setValue}:IncludeExcludeButtonProps )=> {
    return (
        <div onClick={()=>setValue(!value)} className="ml-2 flex hover:cursor-pointer">
            {value ? 
            <div className="text-red-400 hover:text-red-500">
            <HiMinusCircle></HiMinusCircle> 
            </div>
            : 
            <div className="text-slate-400 hover:text-slate-500">
            <HiPlusCircle></HiPlusCircle>
            </div>}
        </div>
    )
}