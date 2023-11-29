import { SearchEmbed } from "@thoughtspot/visual-embed-sdk/lib/src/react"
import { useState } from "react"

interface SearchProps {
    worksheetID: string
}
export const Search = ({worksheetID}:SearchProps) => {
    const [runtimeFilters, setRuntimeFilters] = useState([])
    window.addEventListener('loadReport', function(e:any){
        console.log("here!",e.detail.data)
        setRuntimeFilters(e.detail.data);
    })
    return (
        <div style={{height:'calc(100vh - 530px)'}}>
        <SearchEmbed
        searchOptions={{
            searchTokenString:'[Internet Item Description]',
            executeSearch: true
        }}
        runtimeFilters={runtimeFilters}

        dataSource={worksheetID}
        frameParams={{height:'calc(100vh - 530px)',width:'100%'}}></SearchEmbed>
        </div>
    )
}