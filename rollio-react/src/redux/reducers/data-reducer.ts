// CONSTANTS
import {
    RECIEVE_REGION_DATA,
    RECIEVE_VENDOR_DATA,
    RECIEVE_ALL_VENDORS,
    CLEAR_SELECTED_VENDOR,
    RECEIVE_ALL_REGIONS,
    SET_VENDORS_ALL,
    POST_VENDOR_COMMENT,
    UPDATE_VENDOR,
} from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    regionID: '',
    regionName: '',
    dailyActiveVendors: new Set(),
    regionCoordinates: {
        lat: null,
        long: null
    },
    regionTimezone: '',
    vendorsAll: {},
    regionsAll: [],
    selectedVendor: {
        id: '',
        type: '',
        name: '',
        description: '',
        email: '',
        website: '',
        phoneNumber: '',
        profileImageLink: '',
        bannerImageLink: '',
        categories: [],
        price: '',
        rating: null,
        twitterID: '',
        comments: [],
        creditCard: 'u',
        // TODO: talk to Farris...do locations need a default value?
        locations: [
        //     {
        //     id: '',
        //     coordinates: { lat: null, long: null },
        //     address: '',
        //     neighborhood: '',
        //     municipality: '',
        //     matchMethod: '',
        //     tweetID: null,
        //     accuracy: 0,
        //     startDate: null,
        //     endDate: null
        // }
        ],
        isActive: () => false,
        lastUpdated: null,
        approved: false
    },
    error: {
        code: '',
        message: ''
    }
}

export function dataReducer(state = defaultState, action: any) {
    switch (action.type) {
    case RECIEVE_REGION_DATA:
        return {
            ...state,
            ...action.payload
        }
    case RECIEVE_VENDOR_DATA:
        return {
            ...state,
            selectedVendor: { ...state.selectedVendor, ...action.payload }
        }
    case RECIEVE_ALL_VENDORS:
        return {
            ...state,
            vendorsAll: { ...action.payload }
        }
    case CLEAR_SELECTED_VENDOR:
        return {
            ...state,
            selectedVendor: { ...defaultState.selectedVendor, location: { ...defaultState.selectedVendor.location, coordinates: { lat: null, long: null } } }
        }
    case RECEIVE_ALL_REGIONS:
        return {
            ...state,
            regionsAll: [ ...action.payload.map((region:any) => ({id: region._id, name: region.name})) ]
        }
    case SET_VENDORS_ALL:
        // If the vendor doesn't exist
        if (!state.vendorsAll[action.payload.id]) {
            return {
                ...state,
                error: {
                    code: 'VENDOR_ID_INVALID',
                    message: 'Could not find the vendor id'
                }
            }
        }

        return {
            ...state,
            vendorsAll: {
                ...state.vendorsAll,
                [action.payload.id]: {
                    ...state.vendorsAll[action.payload.id],
                    ...action.payload
                }
            }
        }
    // case SET_PREVIOUSLY_SELECTED_VENDOR:
    //     return {
    //         ...state,
    //         previouslySelected: {
    //             ...state.previouslySelected,
    //             id: action.payload.id
    //         }
    //     }
    case UPDATE_VENDOR:
        const vendorsAll = { ...state.vendorsAll }

        return {
            ...state,
            vendorsAll: { ...vendorsAll, [action.payload.vendorID]: { ...vendorsAll[action.payload.vendorID], locations: action.payload.locations, isActive: action.payload.isActive } }
        }
    case POST_VENDOR_COMMENT:
        return {
            ...state,
            selectedVendor: {
                ...state.selectedVendor,
                comments: [
                    action.payload,
                    ...state.selectedVendor.comments
                ]
            }
        }
    default:
        return state
    }
}
