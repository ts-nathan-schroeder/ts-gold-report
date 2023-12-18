export enum FieldName {
    STORE = 'Store ID',
    CATEGORY = 'Category',
    GROUP = 'Group',
    DIVISION = 'Division',
    DISTRICT = 'District',
    UPC = 'Internet Item Description'
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
    //'Sales % Chg',
    'Units',
    'Units PY',
    'Units Chg',
    //'Units % Chg',
    'AGP',
    'AGP PY',
    'AGP Chg',
    // //'AGP % Chg',
    'Cost of Goods Sold',
    'Cost of Goods Sold PY',
    'Cost of Goods Sold Chg',
    'AGP Rate',
    'AGP Rate PY'
]
export const WeekRollupFields: string[] = [
    'Weeks Scanning',
    'Weeks Scanning PY',
    'Weeks Scanning Chg',
    //'Weeks Scanning % Chg'
]
export const StoreRollupFields: string[] = [
    'Stores Scanning',
    'Stores Scanning PY',
    'Stores Scanning Chg',
    //'Stores Scanning % Chg'
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
    //'AIV % Chg',
    'AGP Unit Amt',
    'AGP Unit Amt PY',
    'AGP Unit Amt Chg',
    'Unit Cost',
    'Unit Cost PY',
    'Unit Cost Chg',
    //'Unit Cost % Chg'
]