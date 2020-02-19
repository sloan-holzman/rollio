// DEPENDENCIES
import React, { FC } from 'react';
import { withRouter } from "react-router";

// COMPONENTS
import TextAreaGrow from '../common/text/textarea-grow';
import ButtonBare from '../common/buttons/button-bare';

// HOOKS
import useCommentAdd from './hooks/use-comment-add';

// ICONS
import { IconContext } from 'react-icons';
import { MdInsertComment } from 'react-icons/md';

const CommentAdd:FC = (props) => {
    const { 
        commentActive,
        commentBody,
        commentName,
        commentErrorMessage,
        getNamePlaceHolder,
        getIsLocked,
        clickNameInput,
        changeText,
        commentBodyTextArea,
        blurComment,
        dispatchRequestPostVendorComment,
    } = useCommentAdd(props);

    return (
        <div className='commentadd__wrapper'>
            <div className='commentadd__tophalf'>
                <IconContext.Provider value={{ size: '32', className: 'commentadd__icon_type_text' }}>
                    <div className='commentadd__icon_wrapper'>
                        <MdInsertComment/>
                    </div>
                </IconContext.Provider>
                {/* Optional Add name but place holder and class changes on click */}
                <div className={ commentActive ? 'commentadd__text_name_active commentadd__text_wrapper' : 'commentadd__text_name_inactive commentadd__text_wrapper'}>
                    <input 
                        id="commentNameInput" 
                        type='text'
                        tabIndex={0} 
                        value={commentName} 
                        onBlur={blurComment} 
                        onFocus={clickNameInput} 
                        onChange={e=>{changeText(e,'name')}} 
                        placeholder={getNamePlaceHolder()} 
                        maxLength={30} 
                        className='font__comment_add_content'/>
                </div>
            </div>

            <div className={ commentActive ? 'commentadd__text_body_active' : 'commentadd__text_body_inactive'}>
                <TextAreaGrow 
                    id='commentBodyTextArea' 
                    onChange={e=>changeText(e,'body')} 
                    onBlur={blurComment} 
                    value={commentBody} 
                    ref={commentBodyTextArea} 
                    placeholder={'Share thoughts...'} 
                    className={'textarea__grow font__textarea_grow font__comment_add_content'}/>
                <div className='commentadd__button_holder'>
                    <ButtonBare
                        id={'commentAddButton'} 
                        text={'SHARE'} 
                        className={'button__comment_add font__button_comment_add'} 
                        overrideClassName={'button__bare_alt'}
                        isLocked={getIsLocked}
                        handleClick={dispatchRequestPostVendorComment}
                    />
                    <p id='commentErrorMessage' className='font__comment_add_error'>{commentErrorMessage}</p>
                </div>
            </div>
        </div>
    )
}

export default withRouter(CommentAdd);
