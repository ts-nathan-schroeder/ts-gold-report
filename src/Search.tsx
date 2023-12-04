import { SearchEmbed } from "@thoughtspot/visual-embed-sdk/lib/src/react"
import { useState } from "react"
import { BaseFields } from "./DataDefinitions";

interface SearchProps {
    worksheetID: string
}
export const Search = ({worksheetID}:SearchProps) => {
    const [searchString, setSearchString] = useState('');
    window.addEventListener('loadReport', function(e:any){
        setSearchString(e.detail.data.searchString);
    })

    let searchBase = "[Week ID].202327";
    for (var field of BaseFields){
        searchBase+= " ["+field+"]"
    }
    return (
        <div style={{height:'calc(100vh - 530px)'}}>
        <SearchEmbed
        searchOptions={{
            searchTokenString: searchString ? searchBase + searchString : '',
            executeSearch: true
        }}
        customizations={{
            style: {
            customCSS: {
                variables: {
                "--ts-var-root-background": "rgb(71 85 105)",
                "--ts-var-viz-border-radius": "25px",
                "--ts-var-viz-box-shadow":"0px"
                },
                rules_UNSTABLE: {
                    '[data-testid="pinboard-header"]': {
                        'display': 'none !important'
                    },
                    '.ReactModalPortal .ReactModal__Overlay':{
                        'background-color': '#ffffff00 !important'
                    },
                    '.answer-module__searchCurtain':{
                        'background-color': '#ffffff00 !important'
                    }
                }
                
            }
            }
        }}
        //runtimeFilters={runtimeFilters}
        forceTable={true}
        dataSource={worksheetID}
        frameParams={{height:'calc(100vh - 530px)',width:'100%'}}></SearchEmbed>
        </div>
    )
}