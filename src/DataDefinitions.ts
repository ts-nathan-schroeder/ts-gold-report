export enum FieldName {
    STORE = 'Store ID',
    CATEGORY = 'Category',
    GROUP = 'Group',
    DIVISION = 'Division',
    DISTRICT = 'District',
    UPC = 'Internet Item Description'
}
export enum FieldID {
    STORE = 'Store ID',
    CATEGORY = 'Category ID',
    GROUP = 'Group ID',
    DIVISION = 'Division ID',
    DISTRICT = 'District ID',
    UPC = 'UPC ID'
}
export enum FieldLabel {
    STORE = 'STORES',
    CATEGORY = 'CATEGORIES',
    GROUP = 'GROUPS',
    DIVISION = 'DIVISIONS',
    DISTRICT = 'DISTRICTS',
    UPC = 'UPCS'
}
export const BaseFields: string[] = [
    'Sales',
    'Sales PY',
    'Sales Chg',
    encodeURIComponent('Sales % Chg'),
    'Units',
    'Units PY',
    'Units Chg',
    encodeURIComponent('Units % Chg'),
    'AGP',
    'AGP PY',
    'AGP Chg',
    encodeURIComponent('AGP % Chg'),
    'Cost of Goods Sold',
    'Cost of Goods Sold PY',
    'Cost of Goods Sold Chg',
    'AGP Rate',
    'AGP Rate PY'
]
export const StoreFields: string [] = [
    'Store ID'
]
export const DistrictFields: string[] = [
    'District ID',
    'District Name'
]
export const DivisionFields: string[] = [
    'Division ID',
    'Division Name'
]
export const WeekRollupFields: string[] = [
    'Weeks Scanning',
    'Weeks Scanning PY',
    'Weeks Scanning Chg',
    encodeURIComponent('Weeks Scanning % Chg')
]
export const StoreRollupFields: string[] = [
    'Stores Scanning',
    'Stores Scanning PY',
    'Stores Scanning Chg',
    encodeURIComponent('Stores Scanning % Chg')
]
export const GroupFields: string[] = [
    'Group ID',
    'Group Description'
]
export const CategoryFields: string[] = [
    'Category ID',
    'Category Description'
]
export const UPCFields: string[] = [
    'UPC ID',
    'Internet Item Description',
    'Size',
    'Pack Size',
    'AIV',
    'AIV PY',
    'AIV Chg',
    encodeURIComponent('AIV % Chg'),
    'AGP Unit Amt',
    'AGP Unit Amt PY',
    'AGP Unit Amt Chg',
    'Unit Cost',
    'Unit Cost PY',
    'Unit Cost Chg',
    encodeURIComponent('Unit Cost % Chg')
]