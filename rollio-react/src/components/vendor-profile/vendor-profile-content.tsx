// DEPENDENCIES
import React, { ReactComponentElement } from 'react';

// COMPONENTS
import Comments from '../comments/comment-section';
import VendorProfileToggleComponent from './vendor-profile-toggle-component';
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import Tweet from '../twitter/Tweet';

// HOOKS
import useToggleComponents from './hooks/use-toggle-components';

interface VendorProfileContentProps  {
    isMobile: boolean,
    closeVendor?: any,
    findOnMap: any,
    vendor: any,
    Categories: ReactComponentElement<any>[],
    state: any
}

const VendorProfileContent = (props:VendorProfileContentProps) => {
    const { 
      isMobile, 
      closeVendor, 
      findOnMap, 
      vendor, 
      Categories, 
      state,
    } = props;

    const {components, toggleComponents} = useToggleComponents(vendor.id, {
      ABOUT: false,
      TWITTER: false,
    });
    
    const tweets = state.data.selectedVendor.tweetHistory.map((tweetData:any) => <Tweet 
      twitterUserName={state.data.selectedVendor.twitterUserName} 
      twitterHandle={state.data.selectedVendor.twitterHandle} 
      twitterProfileImage={state.data.selectedVendor.profileImageLink}
      tweetData={tweetData}
    />)

    return (
        <React.Fragment>
        {/* Show or don't show close out X in profile image depending on Mobile or Desktop */}
          { isMobile ?
            <div className='vendorprofile__image_wrapper'>
                <div className='vendorprofile__image'>
                    <img alt={`${vendor.name} logo`} src={vendor.bannerImageLink} /> 
                </div>
            </div> :
            <div className='vendorprofile__image_wrapper'>
                <div className='vendorprofile__image'>
                <div className="vendorprofile__close_wrapper">
                    <i className="material-icons-outlined" onClick={closeVendor}>close</i>
                </div>
                <img alt={`${vendor.name} logo`} src={vendor.bannerImageLink} /> 
                </div>
            </div>
          }

          <div className='font__vendor_profile_title vendorprofile__title_wrapper'>
            <h2>{vendor.name}</h2>
          </div>
    
          <div className='vendorprofile__categories_wrapper'>
            { Categories }
          </div>
    
          <div className='vendorprofile__info_wrapper'>

            { vendor.isActive ? 
              <div className='vendorprofile__info_row_clickable'>
                <div className='vendorprofile__info_icon_wrapper'>
                  <i className="material-icons-outlined">room</i> 
                </div>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  <h2 onClick={ findOnMap }>FIND ON MAP</h2>
                </div>
              </div> :
              null
            }

            { vendor.website ? 
              <div className='vendorprofile__info_row_clickable'>
                <div className='vendorprofile__info_icon_wrapper'>  
                  <i className="material-icons-outlined">web</i> 
                </div>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  { vendor.website ? <h2><a target='_blank' href={vendor.website}>WEBSITE</a></h2> : <h2>WEBSITE UNAVAILABLE</h2> }
                </div>
              </div> :
              null
            }

            { vendor.phoneNumber ? 
              <div className='vendorprofile__info_row_clickable'>
                <div className='vendorprofile__info_icon_wrapper'>
                  <i className="material-icons-outlined">local_phone</i> 
                </div>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  { vendor.phoneNumber ? <h2><a href={`tel:${vendor.phoneNumber}`}>{vendor.phoneNumber}</a></h2> : <h2>PHONE UNAVAILABLE</h2> }
                </div>
              </div> :
              null
            }

            <VendorProfileToggleComponent iconFa={ faTwitter } components={components} toggleComponents={toggleComponents} componentName='twitter'>
              { tweets }
            </VendorProfileToggleComponent>

            <VendorProfileToggleComponent iconMa='local_shipping' components={components} toggleComponents={toggleComponents} componentName='about'>
              <p>{vendor.description}</p>
            </VendorProfileToggleComponent>
    
            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper_alt'>
                <i className="material-icons-outlined">credit_card</i> 
              </div>
              <div className='font__vendor_profile_info_alt flex__verticle_center'>
                { vendor.creditCard === 'y' ? <h2>Accepts Credit Cards</h2> : <h2>Doesn't Accept Credit Card</h2>}
              </div>
            </div>
        
            <div className='vendorprofile__comments_wrapper'>
              <h2 className='vendorprofile__comments_header font__vendor_profile_header_alt'>Comments</h2>
              <Comments comments={state.data.selectedVendor.comments}/>
            </div>
          </div>
        </React.Fragment>
    )
};

export default VendorProfileContent;
