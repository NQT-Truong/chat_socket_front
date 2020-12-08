import React from 'react';

import {MDBBtn} from "mdbreact";

import {CircularProgress} from "@material-ui/core";

import propTypes from 'prop-types';

import styled from "styled-components";

const StyledLoading = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const ButtonLoading = React.memo((props) => {
    return (
        <MDBBtn
            {...props}
        >
            <span className={`${props.loading ? 'opacity-0' : ''}`}>
                {props.title ?? "CLICK ME"}
            </span>
            {
                props.loading
                &&
                <StyledLoading className='row-all-center'>
                    <CircularProgress
                        size={20}
                        color='inherit'
                    />
                </StyledLoading>
            }
        </MDBBtn>
    );
});

ButtonLoading.defaultProps = {
    className: '',
    color: 'indigo',
    title: '',
    loading: false
}

ButtonLoading.propTypes = {
    className: propTypes.string,
    color: propTypes.string,
    title: propTypes.string,
    loading: propTypes.bool
};

export default ButtonLoading;
