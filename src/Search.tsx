import { SearchEmbed } from "@thoughtspot/visual-embed-sdk/lib/src/react"
import { useRef, useState } from "react"
import { BaseFields } from "./DataDefinitions";

interface SearchProps {
    worksheetID: string
}
export const Search = ({worksheetID}:SearchProps) => {
    const [searchString, setSearchString] = useState('');
    let ref = useRef<HTMLDivElement>(null);
    let loadingRef = useRef<HTMLDivElement>(null);
    window.addEventListener('loadReport', function(e:any){
        setSearchString(e.detail.data.searchString);
        if (ref && ref.current && loadingRef && loadingRef.current){
            ref.current.style.display="none"
            loadingRef.current.style.display="flex"
        }
    })

    let searchBase = "[Week ID].202327";
    for (var field of BaseFields){
        searchBase+= " ["+field+"]"
    }
    return (
        <>
        <div ref={ref} style={{height:'calc(100vh - 580px)',display:'none',width:'100%'}}>
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
        onData={() => {
            if (ref && ref.current && loadingRef && loadingRef.current){
                ref.current.style.display="flex"
                loadingRef.current.style.display="none"
            }
        }}
        frameParams={{height:'600px',width:'100%'}}></SearchEmbed>
        </div>
        <div ref={loadingRef} className="w-full flex h-full align-center justify-center items-center bg-slate-600">
            LOADING ...
        </div>
        </>
    )
}