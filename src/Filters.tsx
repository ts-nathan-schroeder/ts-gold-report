import { useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
  import { HiBan, HiMinusCircle, HiPlay, HiPlusCircle } from "react-icons/hi";
  import { HiMiniPlay } from "react-icons/hi2";

import {FieldName, FieldLabel} from "./DataDefinitions"
interface FilterProps{
    tsURL: string
}

export const Filters: React.FC<FilterProps> = ({tsURL}:FilterProps) => {
    const [calendarWeek, setCalendarWeek] = useState('promo')
    const [timeFrame,setTimeFrame] = useState('this week')
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
	const [obNbSelection, setObNbSelection] = useState('OB & NB');

    const [sameStore, setSameStore] = useState(false); 
    const [regStore, setRegStore] = useState(false); 


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
        // searchString+=" [Week ID]."+"'"+timeFrame+"'"

        
        const event = new CustomEvent('loadReport', {detail: {data: {
            searchString: searchString}
        }});
        window.dispatchEvent(event)
    }


    return (
        <div className="flex flex-row w-full bg-slate-600 p-4 space-x-4" style={{height:'580px'}}>
            <div className="flex flex-col w-1/3 h-full space-y-4">
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        1. TIME FRAME
                    </div>
                    <div className="bg-slate-100 rounded-lg p-4 text-lg">
                        <div className="font-bold">Choose Time Frame</div>
                        <div onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <input type="radio" value="promo" name="timeframe" /> Promo Week
                            <input className="ml-4" type="radio" value="fiscal" name="timeframe" /> Fiscal Week
                        </div>

                        <select className="w-full" onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <option value='last week'>Last Week</option>
                            <option value='last 4 weeks'>Last 4 Weeks</option>
                            <option value='last 12 weeks'>Last 12 Weeks</option>
                            <option value='last 24 weeks'>Last 24 Weeks </option>
                            <option value='last 26 weeks'>Last 26 Weeks</option>
                            <option value='last 52 weeks'>Last 52 Weeks</option>
                            <option value='yesterday'>Yesterday</option>
                            <option value='today'>Today</option>
                            <option value='last quarter'>Last Quarter</option>
                            <option value='last 4 weeks'>Last Period</option>
                            <option value='last year'>Last Year</option>
                            <option value='this quarter'>This Quarter</option>
                            <option value='last 4 weeks'>This Period</option>
                            <option value='year to date'>Year To Date</option>
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
                            <div className="mr-2 font-normal">Roll Up</div>
                            <input onChange={()=>setDivisionRollup(!divisionRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionRollup ?
                    <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={division} field={FieldName.DIVISION} fieldLabel={FieldLabel.DIVISION} setFilter={setDivision} multiple={true}  height={"h-28"}></DropdownFilter>
                    :
                    <div className="h-28 w-full bg-white flex items-center justify-center">
                    {'All '+FieldLabel.DIVISION}
                    </div>
                    }
                    </div>
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-3/4">Choose District
                        <IncludeExcludeButton value={districtExclude}  setValue={setDistrictExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-3/4">
                            <div className="mr-2 font-normal">Roll Up</div>
                            <input onChange={()=>setDistrictRollup(!districtRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!divisionRollup && !districtRollup ?
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"Division Name",
                        op1:divisionExclude? "NE" : "IN",
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
                            <div className="mr-2 font-normal">Roll Up</div>
                            <input onChange={()=>setStoreRoleup(!storeRollup)} type="checkbox"></input>
                        </div>
                    </div>
                    {!storeRollup && !divisionRollup && !districtRollup ?
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:"District Name",
                        op1:districtExclude? "NE" : "IN",
                        val1:district,
                        col2:"Division Name",
                        op2:divisionExclude? "NE" : "IN",
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
                                    <div className="mr-2 font-normal">Roll Up</div>
                                    <input onChange={()=>setGroupRollup(!groupRollup)} type="checkbox"></input>
                                </div>
                            </div>
                            <DropdownFilter tsURL={tsURL} runtimeFilters={{}} value={group} fieldLabel={FieldLabel.GROUP} field={FieldName.GROUP} setFilter={setGroup} multiple={true} height={"h-52"}></DropdownFilter>
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row font-bold w-full">
                                    <div className="flex justify-start w-1/2">Category Hierarchy
                                    <IncludeExcludeButton value={categoryExclude}  setValue={setCategoryExclude}></IncludeExcludeButton>
                                    </div>
                                    <div className="flex justify-end w-1/2">
                                        <div className="mr-2 font-normal">Roll Up</div>
                                        <input onChange={()=>setCategoryRollup(!categoryRollup)} type="checkbox"></input>
                                    </div>
                            </div>
                            {group.length>0 && group[0]!='ALL' ? 
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:"Group Description",
                                op1:groupExclude? "NE" : "IN",
                                val1:group,
                            }} value={category} field={FieldName.CATEGORY} fieldLabel={FieldLabel.CATEGORY} setFilter={setCategory} multiple={true} height={"h-52"}></DropdownFilter>
                            :
                            <div className="h-52 w-full bg-white flex items-center justify-center">
                            {'All '+FieldLabel.CATEGORY}
                            </div>
                            }
                            </div>
                    </div>
                    <div className="flex flex-col h-full w-7/12 text-lg">
                        <div className="flex flex-row">
                        <div className="flex flex-col h-full w-9/12">
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
                                {group.length>0 && group[0]!='ALL'&& category.length>0 && category[0]!='ALL'  ?
                                <DropdownFilter key={group[0]+category[0]} tsURL={tsURL} runtimeFilters={{
                                    col1:"Group Description",
                                    op1:groupExclude ? "NE" : "IN",
                                    val1:group,
                                    col2:"Category Description",
                                    op2:categoryExclude ? "NE" : "IN" ,
                                    val2:category
                                }} value={upc} field={FieldName.UPC} fieldLabel={FieldLabel.UPC} setFilter={setUpc} multiple={true} height={"h-96"}></DropdownFilter>
                                :
                                <div className="h-96 w-full bg-white flex items-center justify-center">
                                    {'All '+FieldLabel.UPC}
                                </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col h-full w-3/12 text-lg ml-4 justify-center">
                            <div className="font-bold">Additional Fields</div>
                            <div className="mt-2 mb-2"> {/* Adjusted margins for compact spacing */}
                                <label className="block">
                                    <input type="radio" name="obNbSelection" value="OB & NB" checked={obNbSelection === 'OB & NB'} onChange={() => setObNbSelection('OB & NB')} />
                                    OB & NB
                                </label>
                                <label className="block">
                                    <input type="radio" name="obNbSelection" value="NB Only" checked={obNbSelection === 'NB Only'} onChange={() => setObNbSelection('NB Only')} />
                                    NB Only
                                </label>
                                <label className="block">
                                    <input type="radio" name="obNbSelection" value="OB Only" checked={obNbSelection === 'OB Only'} onChange={() => setObNbSelection('OB Only')} />
                                    OB Only
                                </label>
                            </div>
                            <hr className="border-t border-gray-300 mb-2" />

                            <div><input className="mr-2" onChange={()=>toggleField("Corp. Banner")} type="checkbox"></input>Corp. Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Store Banner")} type="checkbox"></input>Store Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Vendor Brand")} type="checkbox"></input>Vendor</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Class")} type="checkbox"></input>Class</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Sub Class")} type="checkbox"></input>Sub Class</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Date")} type="checkbox"></input>Date</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Period ID")} type="checkbox"></input>Period ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Quarter ID")} type="checkbox"></input>Quarter ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("CIG")} type="checkbox"></input>CIG</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Parent Vendor")} type="checkbox"></input>Parent Vendor</div>
                            <div><input className="mr-2" onChange={()=>setRegStore(!regStore)} type="checkbox"></input>Same Store</div>
                            <div><input className="mr-2" onChange={()=>setSameStore(!sameStore)} type="checkbox"></input>Reg Stores Only</div>
                        </div>
                    </div>
                    <div onClick={onReportLoad}  className="flex bg-slate-600 hover:bg-slate-500 align-center items-center p-2 text-white font-bold rounded-lg  hover:cursor-pointer">
                            <div className="w-1/2">
                            Load Report
                            </div>
                            <div className="flex w-1/2 justify-end">
                            <div className="flex bg-yellow-400 m-1 w-16 rounded-md items-center justify-center"><HiMiniPlay></HiMiniPlay>GO!</div>
                            </div>
                    </div>
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