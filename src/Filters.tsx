import { useRef, useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
  import { HiBan, HiMinusCircle, HiPencil, HiPlay, HiPlusCircle } from "react-icons/hi";
  import { HiFunnel, HiMiniPlay } from "react-icons/hi2";

  import {DateRangePicker} from "react-date-range"


import {FieldName, FieldLabel, GroupFields, CategoryFields, UPCFields, FieldID, StoreFields, DivisionFields, DistrictFields} from "./DataDefinitions"
interface FilterProps{
    tsURL: string,
}

export const Filters: React.FC<FilterProps> = ({tsURL}:FilterProps) => {
    const [calendarWeek, setCalendarWeek] = useState('fiscal')
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

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [dateRange, setDateRange] = useState<any[]>()

    const filterRef = useRef<HTMLDivElement>(null);

    const [copyPasteProductList, setCopyPasteProductList] = useState<string[] | null>(null)
    const [copyPasteProductListColumn, setCopyPasteProductListColumn] = useState<string | null>(null);
    const [copyPasteLocationList, setCopyPasteLocationList] = useState<string[] | null>(null)
    const [copyPasteLocationListColumn, setCopyPasteLocationListColumn] = useState<string | null>(null);


    function toggleProductCopyPaste(val: string[], field: string){
        if (val.length > 0){
            setCopyPasteProductList(val)
            setCopyPasteProductListColumn(field)
        }else{
            setCopyPasteProductList(null)
            setCopyPasteProductListColumn(null)
        }
    }
    function toggleLocationCopyPaste(val: string[], field: string){
        if (val.length > 0){
            setCopyPasteLocationList(val)
            setCopyPasteLocationListColumn(field)
        }else{
            setCopyPasteLocationList(null)
            setCopyPasteLocationListColumn(null)
        }
    }


    function toggleExpandFilters(){
        if (filterRef && filterRef.current){
          if (filterRef.current.style.display == "flex"){
            filterRef.current.style.display = "none"
          }else{
            filterRef.current.style.display = "flex"
          }
        }
      }
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
        // if (groupRollup) selectedFieldsCopy.push(FieldName.GROUP)
        // if (categoryRollup) selectedFieldsCopy.push(FieldName.CATEGORY)
        // if (upcRollup) selectedFieldsCopy.push(FieldName.UPC)
        // if (storeRollup) selectedFieldsCopy.push(FieldName.STORE)
        // if (districtRollup) selectedFieldsCopy.push(FieldName.DISTRICT)
        // if (divisionRollup) selectedFieldsCopy.push(FieldName.DIVISION)
        if (obNbSelection != "OB & NB"){
            if (obNbSelection == "OB"){
                searchString += " [Manufacture Type Code].'H'"
            }else{
                searchString += " [Manufacture Type Code].'N'" 
            }
        }
        for (var field of selectedFieldsCopy){
            searchString+="["+field+"] "
        }
        //Add filters

        if (copyPasteProductList && copyPasteProductList.length > 0){
            for (var item of copyPasteProductList){
                searchString+= " ["+copyPasteProductListColumn+"].'"+item+"'"
            }
        }
        if (copyPasteLocationList && copyPasteLocationList.length > 0){
            for (var item of copyPasteLocationList){
                searchString+= " ["+copyPasteLocationListColumn+"].'"+item+"'"
            }
        }

        //Add Product Fields
        if (copyPasteProductListColumn == FieldID.CATEGORY || (category.length > 0 && category[0]!='ALL' && !categoryRollup)){
            for (var categoryField of CategoryFields){
                searchString+=" ["+categoryField+"]"
            } 
        }
        if (copyPasteProductListColumn == FieldID.GROUP || (group.length > 0 && group[0]!='ALL' && !groupRollup)){
            for (var groupField of GroupFields){
                searchString += " ["+groupField+"]"
            }    
        }
        if (copyPasteProductListColumn == FieldID.UPC || (upc.length > 0 && upc[0]!='ALL' && !upcRollup)){
            for (var upcField of UPCFields){
                searchString += " ["+upcField+"]"
            }      
        }

        //Add Location Fields
        if (!storeRollup){
            for (var storeField of StoreFields){
                searchString += " ["+storeField+"]"
            }
        }
        if (!divisionRollup){
            for (var divisionField of DivisionFields){
                searchString += " ["+divisionField+"]"
            }
        }
        if (!storeRollup){
            for (var districtField of DistrictFields){
                searchString += " ["+districtField+"]"
            }
        }


        //Add Product Filters
        if (!copyPasteProductList){
            if ((category.length > 0 && category[0]!='ALL')) {
                if (categoryExclude) searchString+= " ["+FieldName.CATEGORY+"] !="
                for (var value of category){
                    searchString+=" ["+FieldName.CATEGORY +"]."+"'"+value+"'"
                }        
            }
            if ((group.length > 0 && group[0]!='ALL'))  {
                if (groupExclude) searchString+= " ["+FieldName.GROUP+ "] !="
                for (var value of group){
                    searchString+=" ["+FieldName.GROUP+"]."+"'"+value+"'"
                }
            }
            if ((upc.length > 0 && upc[0]!='ALL'))  {
                if (upcExclude) searchString+= " ["+FieldName.UPC+"] !="
                for (var value of upc){
                    searchString+=" ["+FieldName.UPC+"]."+"'"+value+"'"
                }            
            }
        }

        //Add Store Filters
        if (!copyPasteLocationList){
            if ((store.length > 0 && store[0]!='ALL') )  {
                if (storeExclude) searchString+= " ["+FieldName.STORE +"] !="
                for (var value of store){
                    searchString+=" ["+FieldName.STORE+"]."+"'"+value+"'"
                }
            }
            if ((district.length > 0 && district[0]!='ALL'))  {
                if (districtExclude) searchString+= " ["+FieldName.DISTRICT+"] !="
                for (var value of district){
                    searchString+=" ["+FieldName.DISTRICT+"]."+"'"+value+"'"
                }
            }
            if ((division.length > 0 && division[0]!='ALL')) {
                if (divisionExclude) searchString+=" ["+FieldName.DIVISION+"] !="
                for (var value of division){
                    searchString+=" ["+FieldName.DIVISION+"]."+"'"+value+"'"
                }
            }
        }

        if (sameStore){
            searchString+= " [Same Store].'true'"
        }
        if (regStore){
            searchString+=" [Conventional Store Flag].'true'"
        }
        
        
        if (calendarWeek == "fiscal"){
            searchString += " [Date].'"+timeFrame+"'"
        }else{ 
            searchString += " [Promo Week Filters].'"+timeFrame+"'"

        }

        // if (groupRollup){
        //    for (var groupField of GroupFields){}
        //    searchString += '['+groupField+']'
        // }
        // searchString+=" [Week ID]."+"'"+timeFrame+"'"

        console.log()
        const event = new CustomEvent('loadReport', {detail: {data: {
            searchString: searchString}
        }});
        window.dispatchEvent(event)
    }


    return (
        <div className="flex flex-col w-full">
        <ExpandFilterButton toggleExpandFilters={toggleExpandFilters}></ExpandFilterButton>

        <div ref={filterRef} className="flex flex-row w-full bg-slate-600 p-4 space-x-4" style={{height:'660px'}}>
            <div className="flex flex-col w-1/3 h-full space-y-4">
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        1. TIME FRAME
                    </div>
                    <div className="bg-slate-100 rounded-lg p-4 text-lg">
                        <div className="font-bold">Choose Time Frame</div>
                        <div  onChange={(e:any)=>{
                            setCalendarWeek(e.target.value)
                            if (e.target.value == "fiscal"){
                                setTimeFrame("last week")
                            }else{
                                setTimeFrame("last 4 weeks")
                            }
                        }}>
                            <input checked={calendarWeek=="fiscal"}  type="radio" value="fiscal" name="timeframe" /> Fiscal Week
                            <input checked={calendarWeek=="promo"} className="ml-4" type="radio" value="promo" name="timeframe" /> Promo Week
                        </div>
                        {calendarWeek == "fiscal" ?
                        <select className="w-full" onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <option value='last week'>Last Week</option>
                            <option value='yesterday'>Yesterday</option>
                            <option value='today'>Today</option>
                            <option value='Last 4 weeks'>Last 4 Weeks</option>
                            <option value='last 12 weeks'>Last 12 Weeks</option>
                            <option value='last 24 weeks'>Last 24 Weeks </option>
                            <option value='last 26 weeks'>Last 26 Weeks</option>
                            <option value='last 52 weeks'>Last 52 Weeks</option>
                            <option value='last quarter'>Last Quarter</option>
                            <option value='last year'>Last Year</option>
                            <option value='this quarter'>This Quarter</option>
                            <option value='year to date'>Year To Date</option>
                        </select>
                        :
                        <select className="w-full" onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <option value='Last 4 Promo Weeks'>Last 4 Weeks</option>
                            <option value='Last 12 Promo Weeks'>Last 12 Weeks</option>
                            <option value='Last 24 Promo Weeks'>Last 24 Weeks </option>
                            <option value='Last 26 Promo Weeks'>Last 26 Weeks</option>
                            <option value='Last 52 Promo Weeks'>Last 52 Weeks</option>
                        </select>
                        }

                    </div>
                </div>
                
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        2. LOCATION
                    </div>
                    {(copyPasteLocationList && copyPasteLocationList.length >0) ?
                        <div className="flex flex-col w-full h-full items-center justify-center bg-slate-100 rounded-lg p-4 space-y-4">
                        <div> Manual values entered for: <b>{copyPasteLocationListColumn} </b></div>
                        <div> {copyPasteLocationList.length < 20 ? copyPasteLocationList.join(", ") : copyPasteLocationList.length + " Values"}</div>
                        <button className="bg-gray-400 w-24 h-12 rounded-lg text-white" onClick={() => toggleLocationCopyPaste([],"")}>Clear</button>
                        </div>
                    :
                    <div className="flex flex-col bg-slate-100 rounded-lg p-4 space-y-4">
                    <div className="flex flex-col text-lg">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-3/4">
                            Choose Division
                            <IncludeExcludeButton value={divisionExclude}  setValue={setDivisionExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-1/4">
                            <CopyPasteButton onSubmit={(val: string[])=>toggleLocationCopyPaste(val, FieldID.DIVISION)} field={FieldLabel.DIVISION}></CopyPasteButton>
                            <RollUpButton onChange={() => setDivisionRollup(!divisionRollup)} />
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
                            <CopyPasteButton onSubmit={(val: string[])=>toggleLocationCopyPaste(val, FieldID.DISTRICT)} field={FieldLabel.DISTRICT}></CopyPasteButton>
                            <RollUpButton onChange={() => setDistrictRollup(!districtRollup)} />
                        </div>
                    </div>
                    {!divisionRollup && !districtRollup ?
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:FieldName.DIVISION,
                        op1:divisionExclude? "NE" : "IN",
                        val1:division
                    }} value={district} field={FieldName.DISTRICT} fieldLabel={FieldLabel.DISTRICT} setFilter={setDistrict} multiple={true}  height={"h-26"}></DropdownFilter>
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
                            <CopyPasteButton onSubmit={(val: string[])=>toggleLocationCopyPaste(val, FieldID.STORE)} field={FieldLabel.STORE}></CopyPasteButton>
                            <RollUpButton onChange={() => setStoreRoleup(!storeRollup)} />
                        </div>
                    </div>
                    {!storeRollup && !divisionRollup && !districtRollup ?
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:FieldName.DISTRICT,
                        op1:districtExclude? "NE" : "IN",
                        val1:district,
                        col2:FieldName.DIVISION,
                        op2:divisionExclude? "NE" : "IN",
                        val2:division
                    }} value={store} field={FieldName.STORE} fieldLabel={FieldLabel.STORE} setFilter={setStore} multiple={true}  height={"h-26"}></DropdownFilter>
                    :
                    <div className="h-8 w-full bg-white flex items-center justify-center">
                    {storeRollup ? 'Rollup' : 'Not Included'}
                    </div>
                    }
                    </div>
                    </div>
                }
                </div>
            </div>
            <div className="flex flex-col w-full h-full">
                <div className="text-white text-2xl font-bold">
                3. PRODUCT HIERARCHY
                </div>
                
                <div className="flex flex-col w-full h-full items-center justify-center bg-slate-100 rounded-lg p-4">
                {(copyPasteProductList && copyPasteProductList.length >0) ?

                <div>
                    <div> Manual values entered for: <b>{copyPasteProductListColumn} </b></div>
                    <div> {copyPasteProductList.length < 20 ? copyPasteProductList.join(", ") : copyPasteProductList.length + " Values"}</div>
                    <button className="bg-gray-400 w-24 h-12 rounded-lg text-white" onClick={() => toggleProductCopyPaste([],"")}>Clear</button>                    
                </div>
                :
                <div className="flex flex-row w-full h-full bg-slate-100 rounded-lg space-x-4">
                    <></>
                    <div className="flex flex-col h-full w-5/12 text-lg">
                        <div className="mb-4">
                            <div className="flex flex-row font-bold w-full">
                                <div className="flex justify-start w-1/2">Group Hierarchy
                                <IncludeExcludeButton value={groupExclude}  setValue={setGroupExclude}></IncludeExcludeButton>
                                </div>
                                <div className="flex justify-end w-1/2">
                                    <CopyPasteButton onSubmit={(val: string[])=>toggleProductCopyPaste(val, FieldID.GROUP)} field={FieldLabel.GROUP}></CopyPasteButton>
                                    <RollUpButton onChange={()=>setGroupRollup(!groupRollup)} />
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
                                        <CopyPasteButton onSubmit={(val: string[])=>toggleProductCopyPaste(val, FieldName.CATEGORY)} field={FieldLabel.CATEGORY}></CopyPasteButton>
                                        <RollUpButton onChange={() => setCategoryRollup(!categoryRollup)} />
                                    </div>
                            </div>
                            {group.length>0 && group[0]!='ALL' ? 
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:FieldName.GROUP,
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
                                        <CopyPasteButton onSubmit={(val: string[])=>toggleProductCopyPaste(val, FieldID.UPC)} field={FieldLabel.UPC}></CopyPasteButton>
                                        <RollUpButton onChange={() => setUpcRollup(!upcRollup)} />

                                    </div>
                                </div>
                                {group.length>0 && group[0]!='ALL'&& category.length>0 && category[0]!='ALL'  ?
                                <DropdownFilter key={group[0]+category[0]} tsURL={tsURL} runtimeFilters={{
                                    col1:FieldName.GROUP,
                                    op1:groupExclude ? "NE" : "IN",
                                    val1:group,
                                    col2:FieldName.CATEGORY,
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
                        <div className="flex flex-col h-full w-3/12 text-sm ml-4 justify-center">
                            <div className="font-bold text-lg">Additional Fields</div>
                            <div className="mt-2 mb-2 text-sm"> {/* Adjusted margins for compact spacing */}
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="OB & NB" checked={obNbSelection === 'OB & NB'} onChange={() => setObNbSelection('OB & NB')} />
                                    OB & NB
                                </label>
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="NB" checked={obNbSelection === 'NB Only'} onChange={() => setObNbSelection('NB Only')} />
                                    NB Only
                                </label>
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="OB" checked={obNbSelection === 'OB Only'} onChange={() => setObNbSelection('OB Only')} />
                                    OB Only
                                </label>
                            </div>
                            <hr className="border-t border-gray-300 mb-2" />

                            <div><input className="mr-2" onChange={()=>toggleField("Banner Corporate")} type="checkbox"></input>Corp. Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Banner Store")} type="checkbox"></input>Store Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Vendor Brand")} type="checkbox"></input>Vendor</div>
                            {/* class id + description when class selected */}
                            <div><input className="mr-2" onChange={()=>toggleField("Class")} type="checkbox"></input>Class</div>

                            <div><input className="mr-2" onChange={()=>toggleField("Sub Class")} type="checkbox"></input>Sub Class</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Date")} type="checkbox"></input>Date</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Period ID")} type="checkbox"></input>Period ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Quarter ID")} type="checkbox"></input>Quarter ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("CIG")} type="checkbox"></input>CIG</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Vendor Parent")} type="checkbox"></input>Parent Vendor</div>
                            <div><input className="mr-2" onChange={()=>setSameStore(!sameStore)} type="checkbox"></input>Same Store</div>
                            <div><input className="mr-2" onChange={()=>setRegStore(!regStore)} type="checkbox"></input>Reg Stores Only</div>
                        </div>
                    </div>

                    </div>
                </div>
                }

                    <div onClick={onReportLoad}  className="flex w-full bg-slate-600 hover:bg-slate-500 align-center items-center p-2 text-white font-bold rounded-lg  hover:cursor-pointer">
                        <span>Load Report</span>
                        <div className="ml-auto flex items-center bg-yellow-400 hover:bg-yellow-300 rounded-lg px-4 py-1">
                            <HiMiniPlay className="mr-2" /> {/* Icon next to "GO" */}
                            GO!
                        </div>
                    </div>
      
            </div>
        </div>
        </div>
        </div>

    )
}

interface CopyPasteButtonProps {
    onSubmit: (list: string[])=> void,
    field: string
}
const CopyPasteButton: React.FC<CopyPasteButtonProps> = ({onSubmit, field}:CopyPasteButtonProps )=> {
    const [popupVisible, setPopupVisible] = useState(false);
    const [values, setValues] = useState<string>('')

    const ToggleSubmit = () =>{
        setPopupVisible(false);
        onSubmit(values.split("\n"))
    }
    const ToggleClear = () => {
        setValues("")
        setPopupVisible(false);
        onSubmit([])

    }
    return (
        <>
            <HiPencil onClick={() => setPopupVisible(!popupVisible)}></HiPencil>
            {popupVisible && (
                
            <div className="absolute w-96 flex flex-col shadow-2xl border-1 border-slate-600 bg-slate-200 rounded-lg font-normal p-4 space-y-4">
                <div className="w-full">{field + " - Paste a list of IDs"}</div>
                <textarea className="w-90 h-40 rounded-md" value={values} onChange={(e)=> setValues(e.target.value)}></textarea>
                <div className="bg-slate-600 h-16 w-full items-center justify-center flex space-x-4 rounded-lg">
                <button className="bg-yellow-400 w-24 h-12 rounded-lg text-white " onClick={ToggleSubmit}>Submit</button>
                <button className="bg-gray-400 w-24 h-12 rounded-lg text-white " onClick={ToggleClear}>Clear</button>
                </div>
            </div>
            
            )}
        </>
    )
}
interface RollUpButtonProps {
    onChange:  () => void,
}
const RollUpButton: React.FC<RollUpButtonProps> = ({onChange}:RollUpButtonProps )=> {
    return (
        <>
            <div className="mr-2 font-normal">Roll Up</div>
            <input onChange={onChange} type="checkbox"></input>
        </>
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
interface ExpandFilterProps {
    toggleExpandFilters: () => void
}
const ExpandFilterButton: React.FC<ExpandFilterProps> = ({toggleExpandFilters}: ExpandFilterProps) => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    function expandFilters(){
        setFiltersVisible(!filtersVisible)
        toggleExpandFilters()
    }
    return (
        <div className="flex h-16 bg-slate-200 flex-row m-4 rounded-md">
            <div className="flex w-1/2 items-center justify-start ml-4">GOLD REPORT</div>
            <div onClick={expandFilters} className="mr-4 flex w-1/2 items-center justify-end font-bold hover:cursor-pointer text-2xl">
                {
                filtersVisible ?<><div className="text-sm mr-2">EXPAND</div> <HiFunnel></HiFunnel></>: <><div className="text-sm mr-2">COLLAPSE</div><HiFunnel></HiFunnel></>
                }</div>

        </div>
    )
}